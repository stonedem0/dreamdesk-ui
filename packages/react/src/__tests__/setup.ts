import "@testing-library/jest-dom/vitest";

// happy-dom doesn't implement Web Animations API — call onfinish immediately
if (!HTMLElement.prototype.animate) {
  HTMLElement.prototype.animate = function() {
    const anim: any = { finished: Promise.resolve(), cancel: () => {}, onfinish: null };
    queueMicrotask(() => anim.onfinish?.());
    return anim;
  };
}
