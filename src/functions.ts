import {Vector3} from "three";

export function latLngToVector(
  lat: number,
  lng: number,
  radius: number,
  height: number
): Vector3 {
  if (lat < -90 || lat > 90) {
    console.log("Latiture cannot be over 90 or under -90.");
  }

  if (lng < -180 || lng > 180) {
    console.log("Longeture cannot be over 180 or under -180.");
  }

  const phi = (lat * Math.PI) / 180;
  const theta = ((lng - 180) * Math.PI) / 180;
  const x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + height) * Math.sin(phi);
  const z = (radius + height) * Math.cos(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class TouchHelper {
  prevRotation: number = 0;
  rotationDelta: number = 0;

  constructor(ctx: HTMLCanvasElement) {
    ctx.addEventListener("touchstart", (event) => {
      const [curr] = this.getRotationAngle(event);
      this.rotationDelta = 0;
      this.prevRotation = curr;
    });

    ctx.addEventListener("touchend", () => {
      this.rotationDelta = 0;
      this.prevRotation = 0;
    });

    ctx.addEventListener(
      "touchmove",
      (event: TouchEvent & {rotation?: number}) => {
        if (event.touches.length > 1) {
          const [curr, delta] = this.getRotationAngle(event);

          this.rotationDelta = delta;
          this.prevRotation = curr;
        }
      }
    );
  }

  getRotationAngle(event: TouchEvent & {rotation?: number}): [number, number] {
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

    return [rotation, rotation - this.prevRotation];
  }
}
