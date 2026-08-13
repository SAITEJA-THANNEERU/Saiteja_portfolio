import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF | null> => {
    let blobUrl: string | null = null;

    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );

      blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      const gltf = await new Promise<GLTF>((resolve, reject) => {
        loader.load(blobUrl!, resolve, undefined, reject);
      });

      const character = gltf.scene;

      /*
       * Compile the model before returning it.
       */
      await renderer.compileAsync(character, camera, scene);

      character.traverse((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh;

        if (!mesh.isMesh) return;

        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;

        if (mesh.material && !Array.isArray(mesh.material)) {
          const material = mesh.material as THREE.Material & {
            precision?: string;
          };

          if ("precision" in material) {
            material.precision = "mediump";
          }
        }
      });

      const footR = character.getObjectByName("footR");
      const footL = character.getObjectByName("footL");

      if (footR) footR.position.y = 3.36;
      if (footL) footL.position.y = 3.36;

      return gltf;
    } catch (error) {
      console.error("Failed to prepare character:", error);
      return null;
    } finally {
      dracoLoader.dispose();

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    }
  };

  return {
    loadCharacter,
  };
};

export default setCharacter;