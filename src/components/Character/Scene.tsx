import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";

import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";

import setAnimations from "./utils/animationUtils";
import { setProgress } from "../utils/loadingProgress";
import { useLoading } from "../../context/LoadingContext";

import {
  setCharTimeline,
  setAllTimeline,
} from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);

  const hoverDivRef =
    useRef<HTMLDivElement | null>(null);

  const sceneRef = useRef(
    new THREE.Scene()
  );

  const { setLoading } = useLoading();

  const [, setChar] =
    useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const canvasElement =
      canvasDiv.current;

    if (!canvasElement) return;

    /*
     * ========================================================
     * LIFECYCLE GUARD
     * ========================================================
     *
     * This is extremely important.
     *
     * If React unmounts this component while the
     * encrypted GLTF is still loading, the old load
     * must NOT add a character when it finishes.
     */

    let cancelled = false;

    /*
     * ========================================================
     * CLEAR OLD CHARACTER / TIMELINES
     * ========================================================
     */

    const scene = sceneRef.current;

    /*
     * Remove any previous objects from the scene.
     */
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    /*
     * Kill ONLY character-related ScrollTriggers.
     */
    const characterTriggerIds = [
      "character-landing",
      "character-about",
      "character-what-build",
      "character-landing-position",
      "character-visibility",
      "career-animation",
    ];

    characterTriggerIds.forEach((id) => {
      const trigger =
        ScrollTrigger.getById(id);

      if (trigger) {
        trigger.kill();
      }
    });

    /*
     * ========================================================
     * SIZE
     * ========================================================
     */

    const rect =
      canvasElement.getBoundingClientRect();

    const width =
      Math.max(rect.width, 1);

    const height =
      Math.max(rect.height, 1);

    /*
     * ========================================================
     * RENDERER
     * ========================================================
     */

    const renderer =
      new THREE.WebGLRenderer({
        alpha: true,
        antialias:
          window.devicePixelRatio < 2,
        powerPreference:
          "high-performance",
      });

    renderer.setSize(
      width,
      height,
      false
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1;

    /*
     * Make absolutely sure this effect owns
     * only one canvas.
     */

    canvasElement
      .querySelectorAll("canvas")
      .forEach((canvas) => {
        canvas.remove();
      });

    canvasElement.appendChild(
      renderer.domElement
    );

    /*
     * ========================================================
     * CAMERA
     * ========================================================
     */

    const camera =
      new THREE.PerspectiveCamera(
        14.5,
        width / height,
        0.1,
        1000
      );

    camera.position.set(
      0,
      13.1,
      24.7
    );

    camera.zoom = 1.1;

    camera.updateProjectionMatrix();

    /*
     * ========================================================
     * STATE
     * ========================================================
     */

    let loadedCharacter:
      | THREE.Object3D
      | null = null;

    let headBone:
      | THREE.Object3D
      | null = null;

    let screenLight:
      | THREE.Object3D
      | null = null;

    let mixer:
      | THREE.AnimationMixer
      | null = null;

    let animationsCleanup: (() => void) | null = null;

    const clock =
      new THREE.Clock();

    /*
     * ========================================================
     * LIGHTING
     * ========================================================
     */

    const light =
      setLighting(scene);

    /*
     * ========================================================
     * LOADING
     * ========================================================
     */

    const progress =
      setProgress((value) => {
        setLoading(value);
      });

    /*
     * ========================================================
     * CHARACTER LOADER
     * ========================================================
     */

    const { loadCharacter } =
      setCharacter(
        renderer,
        scene,
        camera
      );

    /*
     * ========================================================
     * LOAD CHARACTER
     * ========================================================
     */

    loadCharacter()
      .then((gltf) => {
        /*
         * IMPORTANT:
         *
         * If this component has already been
         * cleaned up, DO NOT add this model.
         */

        if (cancelled) {
          return;
        }

        if (!gltf) {
          progress.clear();
          return;
        }

        /*
         * Prevent accidental duplicate addition.
         */

        if (loadedCharacter) {
          console.warn(
            "Character already exists. Ignoring duplicate load."
          );

          return;
        }

        loadedCharacter =
          gltf.scene;

        /*
         * ====================================================
         * ADD CHARACTER EXACTLY ONCE
         * ====================================================
         */

        scene.add(
          loadedCharacter
        );

        setChar(
          loadedCharacter
        );

        /*
         * ====================================================
         * CHARACTER BONES
         * ====================================================
         */

        headBone =
          loadedCharacter.getObjectByName(
            "spine006"
          ) || null;

        /*
         * ====================================================
         * SCREEN LIGHT
         * ====================================================
         */

        screenLight =
          loadedCharacter.getObjectByName(
            "screenlight"
          ) || null;

        /*
         * ====================================================
         * ANIMATIONS
         * ====================================================
         */

        const animations =
          setAnimations(gltf);

        mixer =
          animations.mixer;
        animationsCleanup = animations.cleanup;

        /*
         * ====================================================
         * HOVER
         * ====================================================
         */

        if (
          hoverDivRef.current
        ) {
          animations.hover(
            gltf,
            hoverDivRef.current
          );
        }

        /*
         * ====================================================
         * GSAP
         *
         * IMPORTANT:
         * Create timelines AFTER the model
         * has actually been added to the scene.
         * ====================================================
         */

        setCharTimeline(
          loadedCharacter,
          camera
        );

        setAllTimeline();

        /*
         * ====================================================
         * LOADING FINISHED
         * ====================================================
         */

        progress.loaded().then(() => {
          if (cancelled) {
            return;
          }

          window.setTimeout(() => {
            if (cancelled) {
              return;
            }

            light.turnOnLights();

            animations.startIntro();

            /*
             * Refresh only after everything exists.
             */

            requestAnimationFrame(() => {
              if (!cancelled) {
                ScrollTrigger.refresh();
              }
            });
          }, 2500);
        });
      })
      .catch((error) => {
        progress.clear();

        if (!cancelled) {
          console.error(
            "Failed to load character:",
            error
          );
        }
      });

    /*
     * ========================================================
     * MOUSE
     * ========================================================
     */

    let mouse = {
      x: 0,
      y: 0,
    };

    let interpolation = {
      x: 0.1,
      y: 0.2,
    };

    const onMouseMove = (
      event: MouseEvent
    ) => {
      handleMouseMove(
        event,
        (x, y) => {
          mouse = { x, y };
        }
      );
    };

    /*
     * ========================================================
     * TOUCH
     * ========================================================
     */

    let debounce:
      | ReturnType<typeof setTimeout>
      | undefined;

    const onTouchMove = (
      event: TouchEvent
    ) => {
      handleTouchMove(
        event,
        (x, y) => {
          mouse = { x, y };
        }
      );
    };

    const onTouchStart = (
      event: TouchEvent
    ) => {
      const element =
        event.target as HTMLElement;

      debounce = setTimeout(() => {
        element?.addEventListener(
          "touchmove",
          onTouchMove
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd(
        (
          x,
          y,
          interpolationX,
          interpolationY
        ) => {
          mouse = {
            x,
            y,
          };

          interpolation = {
            x: interpolationX,
            y: interpolationY,
          };
        }
      );
    };

    /*
     * ========================================================
     * EVENTS
     * ========================================================
     */

    document.addEventListener(
      "mousemove",
      onMouseMove
    );

    const landingDiv =
      document.getElementById(
        "landingDiv"
      );

    if (landingDiv) {
      landingDiv.addEventListener(
        "touchstart",
        onTouchStart
      );

      landingDiv.addEventListener(
        "touchend",
        onTouchEnd
      );
    }

    /*
     * ========================================================
     * RESIZE
     * ========================================================
     */

    const onResize = () => {
      if (
        cancelled ||
        !loadedCharacter
      ) {
        return;
      }

      handleResize(
        renderer,
        camera,
        canvasDiv
      );

      requestAnimationFrame(() => {
        if (!cancelled) {
          ScrollTrigger.refresh();
        }
      });
    };

    window.addEventListener(
      "resize",
      onResize
    );

    /*
     * ========================================================
     * RENDER LOOP
     * ========================================================
     */

    let animationFrameId =
      0;

    const animate = () => {
      if (cancelled) {
        return;
      }

      animationFrameId =
        requestAnimationFrame(
          animate
        );

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );

        light.setPointLight(
          screenLight
        );
      }

      const delta =
        clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */

    return () => {
      /*
       * FIRST:
       * Mark this instance dead.
       *
       * Any async load that finishes afterwards
       * will be ignored.
       */

      cancelled = true;
      progress.clear();

      /*
       * Stop animation loop.
       */

      cancelAnimationFrame(
        animationFrameId
      );

      /*
       * Clear timeout.
       */

      if (debounce) {
        clearTimeout(debounce);
      }

      /*
       * Remove events.
       */

      document.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "resize",
        onResize
      );

      if (landingDiv) {
        landingDiv.removeEventListener(
          "touchstart",
          onTouchStart
        );

        landingDiv.removeEventListener(
          "touchend",
          onTouchEnd
        );

        landingDiv.removeEventListener(
          "touchmove",
          onTouchMove
        );
      }

      /*
       * Kill character ScrollTriggers.
       */

      characterTriggerIds.forEach(
        (id) => {
          const trigger =
            ScrollTrigger.getById(id);

          if (trigger) {
            trigger.kill();
          }
        }
      );

      /*
       * Remove character.
       */

      if (loadedCharacter) {
        scene.remove(
          loadedCharacter
        );

        loadedCharacter.traverse(
          (object) => {
            const mesh =
              object as THREE.Mesh;

            if (!mesh.isMesh) {
              return;
            }

            if (
              mesh.geometry
            ) {
              mesh.geometry.dispose();
            }

            if (
              mesh.material
            ) {
              if (
                Array.isArray(
                  mesh.material
                )
              ) {
                mesh.material.forEach(
                  (material) => {
                    material.dispose();
                  }
                );
              } else {
                mesh.material.dispose();
              }
            }
          }
        );
      }

      /*
       * Clear scene.
       */

      while (
        scene.children.length > 0
      ) {
        scene.remove(
          scene.children[0]
        );
      }

      /*
       * Stop character-specific animation resources.
       */

      const intensityInterval = loadedCharacter?.userData.intensityInterval;
      if (typeof intensityInterval === "number") {
        window.clearInterval(intensityInterval);
      }

      loadedCharacter?.userData.screenLightFlickerTimeline?.kill?.();
      animationsCleanup?.();

      /*
       * Dispose renderer.
       */

      renderer.dispose();

      /*
       * Remove canvas.
       */

      if (
        renderer.domElement
          .parentElement ===
        canvasElement
      ) {
        canvasElement.removeChild(
          renderer.domElement
        );
      }
    };
  }, [setLoading]);

  return (
    <div
  ref={canvasDiv}
  className="character-model"
  style={{
    width: "100%",
    height: "100%",
  }}
>
      <div
        ref={hoverDivRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Scene;