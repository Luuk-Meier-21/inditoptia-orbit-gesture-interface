import {
  Mesh,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  SphereGeometry,
} from "three";

export function createSphere(
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
