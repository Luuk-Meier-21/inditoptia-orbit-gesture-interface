import {Object3D, PerspectiveCamera, Vector3} from "three";
import {OrbitControls} from "three/examples/jsm/Addons.js";
import {OFFSET_MAX, OFFSET_MIN} from "./main";

/**
 * Substracts camera pos from sphere pos to calc correct angle to rotate sphere on.
 * @param object A mesh object to rotate.
 * @param camera A camera object as relative position to the rotating object.
 */
export function rotateOnCameraZ(
  object: Object3D,
  camera: PerspectiveCamera,
  rotationDelta: number
) {
  const spherePosition = object.position.clone();
  const cameraPosition = camera.position.clone();

  const direction = new Vector3();

  direction.subVectors(cameraPosition, spherePosition).normalize();
  object.rotateOnAxis(direction, -rotationDelta * 0.02);
}

export function setupControls(
  camera: PerspectiveCamera,
  element?: HTMLElement | undefined
) {
  const controls = new OrbitControls(camera, element);
  controls.zoomSpeed = 0.75;
  controls.rotateSpeed = 0.5;
  controls.minDistance = OFFSET_MIN;
  controls.maxDistance = OFFSET_MAX;
  controls.enablePan = false;

  return controls;
}
