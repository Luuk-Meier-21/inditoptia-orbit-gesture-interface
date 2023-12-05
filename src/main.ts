import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

const SPHERE_RADIUS = 15;

let prevRotation = 0;
let rotationDelta = 0;

function getAngle(event: TouchEvent & {rotation?: number}): [number, number] {
  let rotation = event.rotation;

  // This isn't a fun browser!
  if (!rotation) {
    rotation =
      (Math.atan2(
        event.touches[0].pageY - event.touches[1].pageY,
        event.touches[0].pageX - event.touches[1].pageX
      ) *
        180) /
      Math.PI;
  }

  return [rotation, rotation - prevRotation];
}

function main() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

  // camera.up.set(0, 0, 1); // <=== spin around Z-axis

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const canvas = document.body.appendChild(renderer.domElement);
  const controls = setupControls(camera, canvas);
  const geometry = new SphereGeometry(SPHERE_RADIUS, 32, 16);
  console.log(geometry.getAttribute("position"));

  const material = new MeshBasicMaterial({
    color: 0xff4f00,
    wireframe: true,
  });

  const sphere = new Mesh(geometry, material);
  scene.add(sphere);

  canvas.addEventListener("touchstart", (event) => {
    const [curr] = getAngle(event);
    rotationDelta = 0;
    prevRotation = curr;
  });

  canvas.addEventListener("touchend", () => {
    rotationDelta = 0;
    prevRotation = 0;
  });

  canvas.addEventListener(
    "touchmove",
    (event: TouchEvent & {rotation?: number}) => {
      if (event.touches.length > 1) {
        const [curr, delta] = getAngle(event);

        rotationDelta = delta;
        prevRotation = curr;
      }
    }
  );

  function animate() {
    requestAnimationFrame(animate);

    rotateOnCameraZ(sphere, camera);

    // Needed for updating all manual changes to the camera.
    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}

main();

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
  object.rotateOnAxis(direction, -rotationDelta * 0.03);
}

function setupControls(
  camera: PerspectiveCamera,
  element?: HTMLElement | undefined
) {
  const controls = new OrbitControls(camera, element);
  controls.minDistance = SPHERE_RADIUS + 3;
  controls.maxDistance = 100;
  controls.enablePan = false;

  return controls;
}
