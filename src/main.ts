import {
  Mesh,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {TouchHelper, latLngToVector, random} from "./functions";

const SPHERE_RADIUS = 15;
const TARGET_RADIUS = 1;

const OFFSET_INITIAL = 300;
const OFFSET_MIN = 50;
const OFFSET_MAX = 500;

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
scene.add(largeSphere);

for (let _ in Array.from(Array(3))) {
  const targetSphere = createSphere(TARGET_RADIUS, 16, "target", {
    color: 0xef3aff,
  });
  const latRand = random(-90, 90);
  const lgnRand = random(-180, 180);
  const av = latLngToVector(latRand, lgnRand, SPHERE_RADIUS, 0);
  targetSphere.position.set(av.x, av.y, av.z);
  targetSphere.layers.enable(1);
  scene.add(targetSphere);
}

const DEBOUNCE_MILISEC = 2000;
let currDebounceId: number | undefined;
function animate() {
  requestAnimationFrame(animate);

  rotateOnCameraZ(largeSphere, camera);

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

/**
 * Substracts camera pos from sphere pos to calc correct angle to rotate sphere on.
 * @param object A mesh object to rotate.
 * @param camera A camera object as relative position to the rotating object.
 */
function rotateOnCameraZ(object: Mesh, camera: PerspectiveCamera) {
  const spherePosition = object.position.clone();
  const cameraPosition = camera.position.clone();

  const direction = new Vector3();

  direction.subVectors(cameraPosition, spherePosition).normalize();
  object.rotateOnAxis(direction, -touch.rotationDelta * 0.03);
}

function setupControls(
  camera: PerspectiveCamera,
  element?: HTMLElement | undefined
) {
  const controls = new OrbitControls(camera, element);
  controls.minDistance = OFFSET_MIN;
  controls.maxDistance = OFFSET_MAX;
  controls.enablePan = false;

  return controls;
}

function createSphere(
  radius: number,
  segmentDetail: number,
  name: string,
  materialOptions?: MeshBasicMaterialParameters
): Mesh {
  const geometry = new SphereGeometry(radius, segmentDetail, segmentDetail / 2);
  const material = new MeshBasicMaterial(materialOptions);
  const mesh = new Mesh(geometry, material);

  mesh.name = name;

  return mesh;
}
