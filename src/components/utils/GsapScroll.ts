import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ============================================================
 * CHARACTER SCROLL SYSTEM
 * ============================================================
 *
 * Character lifecycle:
 *
 * LANDING
 *   ↓
 * visible + animated
 *
 * ABOUT
 *   ↓
 * visible + animated
 *
 * WHAT I BUILD
 *   ↓
 * visible + animated
 *
 * CAREER / EXPERIENCE
 *   ↓
 * hidden
 *
 * Scrolling upward reverses the visibility automatically.
 * ============================================================
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

  const isDesktop = window.innerWidth > 1024;

  /*
   * Make sure the character starts visible.
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

      character.userData.screenLightFlickerTimeline =
        flickerTimeline;

      screenLight = object;
    }
  });

  /* ==========================================================
     NECK BONE
  ========================================================== */

  const neckBone = character.getObjectByName("spine005");

  /* ==========================================================
     LANDING ANIMATION
  ========================================================== */

  tl1
    .fromTo(
      character.rotation,
      {
        y: 0,
      },
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

    .fromTo(
      characterModel,
      {
        x: 0,
        y: 0,
      },
      {
        x: isDesktop ? "-25vw" : "0vw",
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

  /* ==========================================================
     DESKTOP LANDING POSITION
  ========================================================== */

  if (isDesktop) {
    ScrollTrigger.create({
      id: "character-landing-position",

      trigger: ".landing-section",

      start: "top top",
      end: "bottom top",

      scrub: true,

      invalidateOnRefresh: true,

      onUpdate: (self) => {
        gsap.set(characterModel, {
          x: `${-25 * self.progress}vw`,
        });
      },
    });
  }

  /* ==========================================================
     ABOUT ANIMATION
  ========================================================== */

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

  /* ==========================================================
     NECK
  ========================================================== */

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

  /* ==========================================================
     MONITOR
  ========================================================== */

  const monitorObject =
    monitor as THREE.Object3D | null;

  if (monitorObject) {
    const monitorMesh =
      monitorObject as THREE.Mesh;

    const material =
      monitorMesh.material;

    if (
      material &&
      !Array.isArray(material)
    ) {
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

  /* ==========================================================
     SCREEN LIGHT
  ========================================================== */

  if (screenLight) {
    const screenLightMesh =
      screenLight as THREE.Mesh;

    const material =
      screenLightMesh.material;

    if (
      material &&
      !Array.isArray(material)
    ) {
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

  /* ==========================================================
     CHARACTER RIM
  ========================================================== */

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

  /* ==========================================================
     WHAT I BUILD
  ========================================================== */

  tl3
.to(
  characterModel,
  {
    y: 0,
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

 /* ==========================================================
   CHARACTER VISIBILITY
   WHAT I BUILD → CAREER
========================================================== */

/*
 * The Career section is now the hard visibility boundary.
 *
 * When Career starts entering the viewport:
 *     character = hidden
 *
 * When scrolling back above Career:
 *     character = visible
 *
 * This works independently from the Career animation itself,
 * so the character cannot remain rendered over Career content.
 */

/* ----------------------------------------------------------
   REMOVE EXISTING VISIBILITY TRIGGER
---------------------------------------------------------- */

const existingCharacterVisibility =
  ScrollTrigger.getById("character-visibility");

if (existingCharacterVisibility) {
  existingCharacterVisibility.kill();
}


/* ----------------------------------------------------------
   INITIAL CHARACTER STATE
---------------------------------------------------------- */

gsap.set(characterModel, {
  opacity: 1,
  visibility: "visible",
  pointerEvents: "none",
});


/* ----------------------------------------------------------
   CAREER VISIBILITY BOUNDARY
---------------------------------------------------------- */

ScrollTrigger.create({
  id: "character-visibility",

  trigger: ".career-section",

  /*
   * As soon as the Career section starts entering
   * the viewport, hide the character.
   *
   * "top bottom" means:
   *
   * Career top reaches viewport bottom
   *             ↓
   * Character disappears
   */

  start: "top bottom",

  /*
   * Keep the trigger active through the Career section.
   */

  end: "bottom top",

  invalidateOnRefresh: true,

  /*
   * --------------------------------------------------------
   * SCROLLING DOWN
   * --------------------------------------------------------
   *
   * Career begins entering viewport.
   */

  onEnter: () => {
    gsap.set(characterModel, {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    });
  },

  /*
   * --------------------------------------------------------
   * SCROLLING UP
   * --------------------------------------------------------
   *
   * User leaves the Career section and returns toward
   * What I Build.
   *
   * Bring the character back.
   */

  onLeaveBack: () => {
    gsap.set(characterModel, {
      opacity: 1,
      visibility: "visible",
      pointerEvents: "none",
    });
  },
});

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

  /* ==========================================================
     CAREER TIMELINE
  ========================================================== */

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

    /* --------------------------------------------------------
       CAREER INFORMATION
    -------------------------------------------------------- */

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

    /* --------------------------------------------------------
       CAREER DOT
    -------------------------------------------------------- */

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

  /* ==========================================================
     CAREER SECTION POSITION
  ========================================================== */

  if (window.innerWidth > 1024) {
    /*
     * Desktop / Laptop
     *
     * Preserve existing desktop movement.
     */

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
    /*
     * Tablet / Mobile
     *
     * Keep Career in its normal position.
     */

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