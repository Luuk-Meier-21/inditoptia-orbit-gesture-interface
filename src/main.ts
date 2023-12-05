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

const largeSphere = createSphere(SPHERE_RADIUS, 32, "globe", {
  color: 0x3ac4ff,
  wireframe: true,
});
largeSphere.layers.enable(2);

const group = new Group();
group.add(largeSphere);

for (let _ in Array.from(Array(3))) {
  const targetSphere = createSphere(TARGET_RADIUS, 16, "target", {
    color: 0xef3aff,
  });
  const latRand = random(-90, 90);
  const lgnRand = random(-180, 180);
  const av = latLngToVector(latRand, lgnRand, SPHERE_RADIUS, 0);
  targetSphere.position.set(av.x, av.y, av.z);
  targetSphere.layers.enable(1);
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

  renderer.render(scene, camera);

  // Run raycast after render.
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const isHoveringTarget = intersects[0].object.layers.isEnabled(1);

    if (isHoveringTarget) {
      if (!currDebounceId) {
        console.log("Yes keep hovering!");
        currDebounceId = setTimeout(() => {
          console.log("Succes!");
          // @ts-ignore
          intersects[0].object.material.color.setHex(0x3ac4ff);
        }, DEBOUNCE_MILISEC);
      }
    } else {
      if (currDebounceId) {
        console.log("Not enough hover time");
        clearTimeout(currDebounceId);
        currDebounceId = undefined;
      }
    }
  }
}

function onPointerMove(event: PointerEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

animate();

window.addEventListener("pointermove", onPointerMove);
