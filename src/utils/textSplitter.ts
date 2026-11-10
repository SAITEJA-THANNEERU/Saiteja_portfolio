// Text splitter utility compatible with the existing GSAP animations.
// Preserves spaces between words and supports reverting original HTML.

export class TextSplitter {
  chars: Element[] = [];
  words: Element[] = [];
  lines: Element[] = [];
  elements: Element[] = [];
  selector: string;

  private originalHTML: Map<Element, string> = new Map();
  private pendingFrames: number[] = [];

  constructor(
    target: string | Element | NodeListOf<Element> | Element[],
    vars?: { type?: string; linesClass?: string }
  ) {
    const type = vars?.type || "chars,words,lines";
    const linesClass = vars?.linesClass || "split-line";

    let elements: Element[] = [];

    if (typeof target === "string") {
      elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof NodeList) {
      elements = Array.from(target);
    } else if (Array.isArray(target)) {
      elements = target;
    } else {
      elements = [target];
    }

    this.selector = typeof target === "string" ? target : "";
    this.elements = elements;

    elements.forEach((element) => {
      this.originalHTML.set(element, element.innerHTML);

      if (type.includes("chars") && type.includes("words")) {
        this.splitWords(element);
        this.splitCharsFromWords(element);
      } else if (type.includes("chars")) {
        this.splitChars(element);
      } else if (type.includes("words")) {
        this.splitWords(element);
      }

      if (type.includes("lines")) {
        this.splitLines(element, linesClass);
      }
    });
  }

  private splitChars(element: Element) {
    const text = element.textContent || "";
    const fragment = document.createDocumentFragment();

    text.split("").forEach((char) => {
      if (char === "\n") {
        fragment.appendChild(document.createElement("br"));
        return;
      }

      const span = document.createElement("span");
      span.className = "split-char";
      span.textContent = char;

      fragment.appendChild(span);
      this.chars.push(span);
    });

    element.replaceChildren(fragment);
  }

  // Keep trailing whitespace inside each word span.
  private splitWords(element: Element) {
    const text = element.textContent || "";
    const fragment = document.createDocumentFragment();

    const tokens = text.match(/\S+\s*/g) || [];

    tokens.forEach((token) => {
      const span = document.createElement("span");
      span.className = "split-word";
      span.textContent = token;

      fragment.appendChild(span);
      this.words.push(span);
    });

    element.replaceChildren(fragment);
  }

  private splitCharsFromWords(element: Element) {
    const words = element.querySelectorAll(".split-word");

    words.forEach((word) => {
      const text = word.textContent || "";
      const fragment = document.createDocumentFragment();

      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.className = "split-char";
        span.textContent = char;

        fragment.appendChild(span);
        this.chars.push(span);
      });

      word.replaceChildren(fragment);
    });
  }

  private splitLines(element: Element, linesClass: string) {
    const frameId = requestAnimationFrame(() => {
      const items = element.querySelectorAll(
        ".split-word, .split-char"
      );

      if (!items.length) return;

      const lines: Element[][] = [];
      let currentLine: Element[] = [];
      let currentTop: number | null = null;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();

        if (currentTop === null || Math.abs(rect.top - currentTop) > 5) {
          if (currentLine.length) {
            lines.push(currentLine);
          }

          currentLine = [item];
          currentTop = rect.top;
        } else {
          currentLine.push(item);
        }
      });

      if (currentLine.length) {
        lines.push(currentLine);
      }

      lines.forEach((line) => {
        if (!line.length) return;

        const wrapper = document.createElement("span");
        wrapper.className = linesClass;
        wrapper.style.display = "block";

        const firstItem = line[0];

        firstItem.parentNode?.insertBefore(wrapper, firstItem);

        line.forEach((item) => {
          if (item.parentNode === wrapper.parentNode) {
            wrapper.appendChild(item);
          }
        });
      });

      this.lines.push(
        ...Array.from(element.querySelectorAll(`.${linesClass}`))
      );
    });

    this.pendingFrames.push(frameId);
  }

  revert() {
    this.pendingFrames.forEach((frameId) => {
      cancelAnimationFrame(frameId);
    });

    this.pendingFrames = [];

    this.elements.forEach((element) => {
      const original = this.originalHTML.get(element);

      if (original !== undefined) {
        element.innerHTML = original;
      }
    });

    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML.clear();
  }
}