import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>
) {
  if (!canvasDiv.current) return;

  const canvas3d =
    canvasDiv.current.getBoundingClientRect();

  const width = Math.max(canvas3d.width, 1);
  const height = Math.max(canvas3d.height, 1);

  /*
   * Update renderer size
   */
  renderer.setSize(width, height, false);

  /*
   * Keep pixel ratio under control
   */
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  /*
   * Update camera
   */
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  /*
   * IMPORTANT
   *
   * Do not recreate the character animation
   * timelines on every resize.
   *
   * Recreating them repeatedly can cause:
   *
   * - duplicated character movement
   * - incorrect poses
   * - arms/hands appearing incorrectly
   * - character jumping between states
   * - incorrect scroll positions
   */

  /*
   * Let the browser finish the resize/layout
   * before asking ScrollTrigger to recalculate.
   */
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}