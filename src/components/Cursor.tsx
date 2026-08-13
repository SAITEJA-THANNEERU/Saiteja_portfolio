import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hover = false;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    let frameId = 0;

    const onMouseMove = (event: MouseEvent) => {
      mousePos.x = event.clientX;
      mousePos.y = event.clientY;
    };

    const interactiveElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor]")
    );

    const handlers: Array<{
      element: HTMLElement;
      mouseover: (event: MouseEvent) => void;
      mouseout: () => void;
    }> = [];

    const loop = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
      }

      frameId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMouseMove);

    interactiveElements.forEach((element) => {
      const onMouseOver = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          gsap.set(cursor, { x: rect.left, y: rect.top });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }

        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", onMouseOver);
      element.addEventListener("mouseout", onMouseOut);
      handlers.push({ element, mouseover: onMouseOver, mouseout: onMouseOut });
    });

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", onMouseMove);

      handlers.forEach(({ element, mouseover, mouseout }) => {
        element.removeEventListener("mouseover", mouseover);
        element.removeEventListener("mouseout", mouseout);
      });

      gsap.killTweensOf(cursor);
    };
  }, []);


  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
