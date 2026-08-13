import * as THREE from "three";
import { GLTF } from "three-stdlib";
import {
  eyebrowBoneNames,
  typingBoneNames,
} from "../../../data/boneData";

const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;

  const mixer = new THREE.AnimationMixer(character);

  let introAction: THREE.AnimationAction | null = null;
  let typingAction: THREE.AnimationAction | null = null;
  let blinkAction: THREE.AnimationAction | null = null;
  let eyebrowAction: THREE.AnimationAction | null = null;
  let blinkTimeout: number | undefined;
  let cleanupHover: (() => void) | null = null;
  let introFinishedHandler: ((event: THREE.Event & { action?: THREE.AnimationAction }) => void) | null = null;

  /*
   * =========================================================
   * INTRO ANIMATION
   * =========================================================
   */

  const introClip = THREE.AnimationClip.findByName(
    gltf.animations,
    "introAnimation"
  );

  if (introClip) {
    introAction = mixer.clipAction(introClip);

    introAction.setLoop(THREE.LoopOnce, 1);
    introAction.clampWhenFinished = true;
    introAction.enabled = true;
    introAction.setEffectiveWeight(1);
  } else {
    console.warn(
      'Animation "introAnimation" was not found.'
    );
  }

  /*
   * =========================================================
   * TYPING ANIMATION
   * =========================================================
   *
   * Only control the typing bones.
   * Do NOT allow this animation to control the entire body.
   */

  typingAction = createBoneAction(
    gltf,
    mixer,
    "typing",
    typingBoneNames
  );

  if (typingAction) {
    typingAction.enabled = true;
    typingAction.setEffectiveWeight(1);
    typingAction.setLoop(THREE.LoopRepeat, Infinity);
    typingAction.timeScale = 1.2;
  } else {
    console.warn(
      'Animation "typing" was not found.'
    );
  }

  /*
   * =========================================================
   * START INTRO
   * =========================================================
   */

  function startIntro() {
    if (!introAction) return;

    /*
     * Stop everything that could interfere with
     * the intro animation.
     */

    if (typingAction) {
      typingAction.stop();
    }

    introAction.reset();
    introAction.enabled = true;
    introAction.setEffectiveWeight(1);
    introAction.setLoop(THREE.LoopOnce, 1);
    introAction.clampWhenFinished = true;
    introAction.play();

    /*
     * Start typing only after the intro has finished.
     */

    const onFinished = (event: THREE.Event & { action?: THREE.AnimationAction }) => {
      if (event.action !== introAction) return;

      mixer.removeEventListener(
        "finished",
        onFinished
      );
      introFinishedHandler = null;

      if (typingAction) {
        typingAction.reset();
        typingAction.enabled = true;
        typingAction.setEffectiveWeight(1);
        typingAction.play();
      }
    };

    introFinishedHandler = onFinished;

    mixer.addEventListener(
      "finished",
      onFinished
    );

    /*
     * Blink after intro.
     */

    blinkTimeout = window.setTimeout(() => {
      const blinkClip = THREE.AnimationClip.findByName(
        gltf.animations,
        "Blink"
      );

      if (!blinkClip) return;

      blinkAction = mixer.clipAction(blinkClip);

      blinkAction.reset();
      blinkAction.setLoop(
        THREE.LoopOnce,
        1
      );
      blinkAction.clampWhenFinished = true;
      blinkAction.setEffectiveWeight(1);
      blinkAction.play();
    }, 2500);
  }

  /*
   * =========================================================
   * HOVER / EYEBROW
   * =========================================================
   */

  function hover(
    _gltf: GLTF,
    hoverDiv: HTMLDivElement
  ) {
    if (!hoverDiv) return;

    eyebrowAction = createBoneAction(
      gltf,
      mixer,
      "browup",
      eyebrowBoneNames
    );

    if (eyebrowAction) {
      eyebrowAction.setLoop(
        THREE.LoopOnce,
        1
      );

      eyebrowAction.clampWhenFinished = true;
      eyebrowAction.enabled = true;
      eyebrowAction.setEffectiveWeight(1);
    }

    let isHovering = false;

    const onHoverFace = () => {
      if (!eyebrowAction || isHovering) {
        return;
      }

      isHovering = true;

      eyebrowAction.reset();
      eyebrowAction.enabled = true;
      eyebrowAction.setEffectiveWeight(1);
      eyebrowAction.fadeIn(0.25);
      eyebrowAction.play();
    };

    const onLeaveFace = () => {
      if (!eyebrowAction || !isHovering) {
        return;
      }

      isHovering = false;

      eyebrowAction.fadeOut(0.3);
    };

    hoverDiv.addEventListener(
      "mouseenter",
      onHoverFace
    );

    hoverDiv.addEventListener(
      "mouseleave",
      onLeaveFace
    );

    cleanupHover = () => {
      hoverDiv.removeEventListener(
        "mouseenter",
        onHoverFace
      );

      hoverDiv.removeEventListener(
        "mouseleave",
        onLeaveFace
      );
    };

    return cleanupHover;
  }

  /*
   * =========================================================
   * RETURN
   * =========================================================
   */

  const cleanup = () => {
    if (blinkTimeout !== undefined) {
      window.clearTimeout(blinkTimeout);
      blinkTimeout = undefined;
    }

    cleanupHover?.();
    cleanupHover = null;

    mixer.stopAllAction();

    if (introFinishedHandler) {
      mixer.removeEventListener("finished", introFinishedHandler);
      introFinishedHandler = null;
    }
  };

  return {
    mixer,
    startIntro,
    hover,
    cleanup,
  };
};


/*
 * ============================================================
 * CREATE BONE ACTION
 * ============================================================
 */

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clipName: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  const clip = THREE.AnimationClip.findByName(
    gltf.animations,
    clipName
  );

  if (!clip) {
    console.warn(
      `Animation "${clipName}" not found in GLTF file.`
    );

    return null;
  }

  const filteredClip =
    filterAnimationTracks(
      clip,
      boneNames
    );

  if (filteredClip.tracks.length === 0) {
    console.warn(
      `Animation "${clipName}" contains no matching bone tracks.`
    );

    return null;
  }

  return mixer.clipAction(filteredClip);
};


/*
 * ============================================================
 * FILTER ANIMATION TRACKS
 * ============================================================
 */

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks =
    clip.tracks.filter((track) =>
      boneNames.some((boneName) =>
        track.name.includes(boneName)
      )
    );

  return new THREE.AnimationClip(
    `${clip.name}_filtered`,
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;