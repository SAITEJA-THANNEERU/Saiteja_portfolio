import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Controls the 3D character throughout the main portfolio.
 *
 * Character lifecycle:
 *
 * Landing     -> visible
 * About       -> visible
 * WHAT I BUILD   -> visible
 * After What  -> hidden
 *
 * Scrolling back up:
 *
 * WHAT I BUILD   -> character becomes visible again
 */
export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  /* ==========================================================
     CHARACTER MODEL ELEMENT
  ========================================================== */

  const characterModel = document.querySelector(
    ".character-model"
  ) as HTMLElement | null;

  if (!characterModel) {
    console.warn(".character-model was not found.");
    return;
  }

  /*
   * Reset the character to its normal CSS position.
   *
   * IMPORTANT:
   * Landing.css already contains:
   *
   * transform: translateX(-50%);
   *
   * Therefore we do NOT use xPercent:-50 here.
   */
  gsap.set(characterModel, {
    x: 0,
    y: 0,
    opacity: 1,
    visibility: "visible",
    pointerEvents: "none",
  });

  /* ==========================================================
     SCREEN LIGHT FLICKER
  ========================================================== */

  let intensity = 0;

  const intensityInterval = window.setInterval(() => {
    intensity = Math.random();
  }, 200);

  /* ==========================================================
     LANDING TIMELINE
  ========================================================== */

  const tl1 = gsap.timeline({
    scrollTrigger: {
      id: "character-landing",
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  /* ==========================================================
     ABOUT TIMELINE
  ========================================================== */

  const tl2 = gsap.timeline({
    scrollTrigger: {
      id: "character-about",
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  /* ==========================================================
     WHAT I BUILD TIMELINE
  ========================================================== */

  const tl3 = gsap.timeline({
  scrollTrigger: {
    id: "character-what-build",
    trigger: ".what-section",
    start: "top top",
    end: "bottom top",
    scrub: true,
    invalidateOnRefresh: true,
  },
});

  /* ==========================================================
     CHARACTER PARTS
  ========================================================== */

  let screenLight: THREE.Object3D | null = null;
  let monitor: THREE.Object3D | null = null;

  character.traverse((object: THREE.Object3D) => {
    /* --------------------------------------------------------
       MONITOR
    -------------------------------------------------------- */

    if (object.name === "Plane004") {
      object.children.forEach((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material;

        if (!material) return;

        const materials = Array.isArray(material)
          ? material
          : [material];

        materials.forEach((mat: THREE.Material) => {
          mat.transparent = true;
          mat.opacity = 0;

          if (mat.name === "Material.027") {
            monitor = child;

            if ("color" in mat) {
              (
                mat as THREE.MeshStandardMaterial
              ).color.set("#FFFFFF");
            }
          }
        });
      });
    }

    /* --------------------------------------------------------
       SCREEN LIGHT
    -------------------------------------------------------- */

    if (object.name === "screenlight") {
      const mesh = object as THREE.Mesh;
      const material = mesh.material;

      if (!material || Array.isArray(material)) return;

      material.transparent = true;
      material.opacity = 0;

      if ("emissive" in material) {
        (
          material as THREE.MeshStandardMaterial
        ).emissive.set("#C8BFFF");
      }

      const flickerTimeline = gsap
        .timeline({
          repeat: -1,
          repeatRefresh: true,
        })
        .to(material, {
          emissiveIntensity: () => intensity * 8,
          duration: () => Math.random() * 0.6,
          delay: () => Math.random() * 0.1,
        });

      character.userData.screenLightFlickerTimeline = flickerTimeline;

      screenLight = object;
    }
  });

  /* ==========================================================
     NECK BONE
  ========================================================== */

  const neckBone = character.getObjectByName("spine005");

  /* ==========================================================
     DESKTOP
  ========================================================== */

  if (window.innerWidth > 1024) {
    /* ========================================================
       LANDING
    ======================================================== */

    tl1
      .fromTo(
        character.rotation,
        { y: 0 },
        {
          y: 0.7,
          duration: 1,
        },
        0
      )

      .to(
        camera.position,
        {
          z: 22,
          duration: 1,
        },
        0
      )

      /*
       * Keep character container centered.
       *
       * Do NOT use xPercent here.
       */
      .fromTo(
  characterModel,
  {
    x: 0,
    y: 0,
  },
  {
    x: "-25vw",
    y: 0,
    duration: 1,
    ease: "power2.out",
  },
  0
)

      .to(
        ".landing-container",
        {
          opacity: 0,
          duration: 0.4,
        },
        0
      )

      .to(
        ".landing-container",
        {
          y: "40%",
          duration: 0.8,
        },
        0
      )

      .fromTo(
        ".about-me",
        {
          y: "-50%",
        },
        {
          y: "0%",
        },
        0
      );

      ScrollTrigger.create({
  id: "character-landing-position",
  trigger: ".landing-section",
  start: "top top",
  end: "bottom top",
  scrub: true,
  onUpdate: (self) => {
    gsap.set(characterModel, {
      x: `${-25 * self.progress}vw`,
    });
  },
});

    /* ========================================================
       ABOUT
    ======================================================== */

    tl2
      .to(
        camera.position,
        {
          z: 75,
          y: 8.4,
          duration: 6,
          delay: 2,
          ease: "power3.inOut",
        },
        0
      )

      
      

     /*
 * Move the character canvas to the left
 * so the About content remains visible
 * on the right.
 */

      .to(
        character.rotation,
        {
          y: 0.92,
          x: 0.12,
          delay: 3,
          duration: 3,
        },
        0
      );

    /* --------------------------------------------------------
       NECK
    -------------------------------------------------------- */

    if (neckBone) {
      tl2.to(
        neckBone.rotation,
        {
          x: 0.6,
          delay: 2,
          duration: 3,
        },
        0
      );
    }

    /* --------------------------------------------------------
       MONITOR
    -------------------------------------------------------- */

    const monitorObject = monitor as THREE.Object3D | null;
    if (monitorObject) {
      const monitorMesh = monitorObject as THREE.Mesh;
      const material = monitorMesh.material;

      if (material && !Array.isArray(material)) {
        tl2.to(
          material,
          {
            opacity: 1,
            duration: 0.8,
            delay: 3.2,
          },
          0
        );
      }

      tl2.fromTo(
        monitorObject.position,
        {
          y: -10,
          z: 2,
        },
        {
          y: 0,
          z: 0,
          delay: 1.5,
          duration: 3,
        },
        0
      );
    }

    /* --------------------------------------------------------
       SCREEN LIGHT
    -------------------------------------------------------- */

    if (screenLight) {
      const screenLightMesh = screenLight as THREE.Mesh;
      const material = screenLightMesh.material;

      if (material && !Array.isArray(material)) {
        tl2.to(
          material,
          {
            opacity: 1,
            duration: 0.8,
            delay: 4.5,
          },
          0
        );
      }
    }

    /* --------------------------------------------------------
       CHARACTER RIM
    -------------------------------------------------------- */

    const characterRim =
      document.querySelector(".character-rim");

    if (characterRim) {
      tl2.fromTo(
        characterRim,
        {
          opacity: 1,
          scaleX: 1.4,
        },
        {
          opacity: 0,
          scale: 0,
          y: "-70%",
          duration: 5,
          delay: 2,
        },
        0.3
      );
    }

 /* ========================================================
   WHAT I BUILD
   ======================================================== */

tl3
  .to(
  characterModel,
  {
    y: 0,
    opacity: 1,
    visibility: "visible",
    duration: 2,
    ease: "power2.out",
  },
  0
)
  .to(
    character.rotation,
    {
      x: -0.04,
      duration: 2,
      delay: 1,
      ease: "power2.out",
    },
    0
  );

/* ========================================================
   CHARACTER STOPS AT CAREER
======================================================== */

ScrollTrigger.create({
  id: "character-visibility",
  trigger: ".career-section",
  start: "top top",
  onEnter: () => {
    gsap.to(characterModel, {
      opacity: 0,
      visibility: "hidden",
      duration: 0.3,
      overwrite: true,
    });
  },
  onLeaveBack: () => {
    gsap.to(characterModel, {
      opacity: 1,
      visibility: "visible",
      duration: 0.3,
      overwrite: true,
    });
  },
});


  } else {
    /* ========================================================
MOBILE / TABLET
    ======================================================== */

    gsap.set(characterModel, {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    });
  }

  /* ==========================================================
STORE CLEANUP INFORMATION
  ========================================================== */

  character.userData.intensityInterval =
    intensityInterval;
}

/* ============================================================
   GLOBAL PAGE ANIMATIONS
============================================================ */

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      id: "career-animation",
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(
      ".career-timeline",
      {
        maxHeight: "0%",
      },
      {
        maxHeight: "100%",
        duration: 1,
        ease: "none",
      },
      0
    )

    .fromTo(
      ".career-timeline",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.2,
      },
      0
    )

    .fromTo(
      ".career-info-box",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
      },
      0
    )

    .fromTo(
      ".career-dot",
      {
        animationIterationCount: "infinite",
      },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      {
        y: 0,
      },
      {
        y: "20%",
        duration: 0.5,
        delay: 0.2,
      },
      0
    );



  } else {
    careerTimeline.fromTo(
      ".career-section",
      {
        y: 0,
      },
      {
        y: 0,
        duration: 0.5,
        delay: 0.2,
      },
      0
    );
  }
}