import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {TouchHelper, latLngToVector, random} from "./functions";
import {rotateOnCameraZ, setupControls} from "./controls";
import {createSphere} from "./object";

export const SPHERE_RADIUS = 15;
export const TARGET_RADIUS = 1;

export const OFFSET_INITIAL = 300;
export const OFFSET_MIN = 50;
export const OFFSET_MAX = 500;
export const TARGET_COUNT = 30;

export enum Layers {
  TARGET = 1,
  GLOBE = 2,
  EFFECT = 3,
}

let completedTargetCount = 0;
const pointer = new Vector2();
const raycaster = new Raycaster();
raycaster.layers.enableAll();

const scene = new Scene();
const camera = new PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, OFFSET_INITIAL);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvas = document.body.appendChild(renderer.domElement);
const controls = setupControls(camera, canvas);
const touch = new TouchHelper(canvas);

const group = new Group();

// Globe
const largeSphere = createSphere(SPHERE_RADIUS, 32, "globe", {
  color: 0x3ac4ff,
  wireframe: true,
});
largeSphere.layers.enable(Layers.GLOBE);
group.add(largeSphere);

// Hover
const hoverSphere = createSphere(1, 16, "globe", {
  color: 0x1cffad,
  wireframe: true,
  visible: true,
});
hoverSphere.visible = false;

hoverSphere.layers.enable(Layers.EFFECT);
group.add(hoverSphere);

// Targets
for (let _ in Array.from(Array(TARGET_COUNT))) {
  const radiusRand = Math.random() * 2;
  const targetSphere = createSphere(radiusRand, 16, "target", {
    color: 0xff3a3a,
  });
  const latRand = random(-90, 90);
  const lgnRand = random(-180, 180);
  const av = latLngToVector(latRand, lgnRand, SPHERE_RADIUS, radiusRand);
  targetSphere.position.set(av.x, av.y, av.z);
  targetSphere.layers.enable(Layers.TARGET);

  targetSphere.userData.radius = radiusRand;
  group.add(targetSphere);
}

scene.add(group);

const DEBOUNCE_MILISEC = 1000;
let currDebounceId: number | undefined;
function animate() {
  requestAnimationFrame(animate);

  rotateOnCameraZ(group, camera, touch.rotationDelta);

  // Needed for updating all manual changes to the camera.
  controls.update();

  hoverSphere.rotation.y += 0.01;
  hoverSphere.rotation.x += 0.01;
  hoverSphere.rotation.z += 0.01;

  renderer.render(scene, camera);

  // Run raycast after render.
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  const relativeIntersects = intersects.filter(
    (inter) =>
      inter.object.layers.isEnabled(Layers.TARGET) ||
      inter.object.layers.isEnabled(Layers.GLOBE)
  );
  if (relativeIntersects.length > 0) {
    const isHoveringTarget = relativeIntersects[0].object.layers.isEnabled(
      Layers.TARGET
    );

    if (isHoveringTarget) {
      if (!currDebounceId) {
        const targetObject = intersects[0].object;
        const v = targetObject.position.clone();
        const m = targetObject.userData.radius * 1.1;

        hoverSphere.position.set(v.x, v.y, v.z);
        hoverSphere.scale.set(m, m, m);
        hoverSphere.visible = true;

        currDebounceId = setTimeout(() => {
          // @ts-ignore
          targetObject.material.color.setHex(0x3ac4ff);
          hoverSphere.position.set(0, 0, 0);
          hoverSphere.scale.set(0, 0, 0);
          hoverSphere.visible = false;
          completedTargetCount++;
        }, DEBOUNCE_MILISEC);
      }
    } else {
      hoverSphere.position.set(0, 0, 0);
      hoverSphere.scale.set(0, 0, 0);
      hoverSphere.visible = false;

      if (currDebounceId) {
        clearTimeout(currDebounceId);
        currDebounceId = undefined;
      }
    }
  }

  if (completedTargetCount >= TARGET_COUNT) {
    alert("Succes, you have captured all targets");

    completedTargetCount = 0;
    group.children
      .filter((child) => child.layers.isEnabled(Layers.TARGET))
      .forEach((child) => {
        // @ts-ignore
        intersects[0].object.material.color.setHex(0xff3a3a);
      });
  }
}

function onPointerMove(event: PointerEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

animate();

window.addEventListener("pointermove", onPointerMove);
