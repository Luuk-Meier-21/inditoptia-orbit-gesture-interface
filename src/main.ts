import * as THREE from "three";
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
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

  // camera.up.set(0, 0, 1); // <=== spin around Z-axis

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const canvas = document.body.appendChild(renderer.domElement);
  const controls = setupControls(camera, canvas);
  const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff4f00,
    wireframe: true,
  });

  const sphere = new THREE.Mesh(geometry, material);
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

    const spherePosition = sphere.position.clone();
    const cameraPosition = camera.position.clone();

    const direction = new THREE.Vector3();

    direction.subVectors(cameraPosition, spherePosition).normalize();
    sphere.rotateOnAxis(direction, -rotationDelta * 0.05);

    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}

main();

function setupControls(
  camera: THREE.Camera,
  element?: HTMLElement | undefined
) {
  const controls = new OrbitControls(camera, element);
  controls.minDistance = SPHERE_RADIUS * 2;
  controls.maxDistance = 100;
  controls.enablePan = false;

  return controls;
}
