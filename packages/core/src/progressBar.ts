export interface ProgressBarOptions {
  track: HTMLElement;
  getValue: () => number;
  isBlocky: () => boolean;
  isGradient: () => boolean;
}

export interface ProgressBarHandle {
  update: (value: number) => void;
  rebuild: () => void;
  destroy: () => void;
}

export function setupProgressBar({ track, getValue, isBlocky, isGradient }: ProgressBarOptions): ProgressBarHandle {
  let segments: HTMLElement[] = [];
  let bar: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let rebuildTimer: ReturnType<typeof setTimeout> | null = null;

  const GAP = 1, SEG_W = 10, FULL_SEG = SEG_W + GAP;

  function buildSegments() {
    const gradient = isGradient();
    const cs = getComputedStyle(track);
    const trackWidth = track.getBoundingClientRect().width
      - (parseFloat(cs.borderLeftWidth) || 0)
      - (parseFloat(cs.borderRightWidth) || 0);
    const count = Math.max(1, Math.round((trackWidth + GAP) / FULL_SEG));
    const segW = (trackWidth - (count - 1) * GAP) / count;
    const fullVisualWidth = trackWidth;
    track.innerHTML = '';
    segments = [];
    for (let i = 0; i < count; i++) {
      const seg = document.createElement('div');
      seg.className = 'progress-segment';
      seg.style.cssText = `width:${segW}px;margin-right:${i < count - 1 ? GAP : 0}px`;
      if (gradient) {
        seg.style.backgroundSize = `${fullVisualWidth}px 100%`;
        seg.style.backgroundPosition = `-${i * (segW + GAP)}px 0`;
      }
      track.appendChild(seg);
      segments.push(seg);
    }
    updateSegments(getValue());
  }

  function updateSegments(value: number) {
    const percent = Math.min(Math.max(value, 0), 100);
    const activeCount = Math.floor((percent / 100) * segments.length);
    segments.forEach((seg, i) => seg.classList.toggle('progress-segment--active', i < activeCount));
  }

  function updateBar(value: number) {
    if (!bar) return;
    const percent = Math.min(Math.max(value, 0), 100);
    const gradient = isGradient();
    bar.style.width = `${percent}%`;
    if (!gradient) {
      const enabled = getComputedStyle(bar).getPropertyValue('--dd-progress-enable-hue-rotate').trim();
      bar.style.filter = enabled === '0' ? 'none' : `hue-rotate(${percent * 3.6}deg)`;
    }
    bar.classList.toggle('progress-bar--complete', value >= 100);
  }

  function rebuild() {
    const blocky = isBlocky();
    const gradient = isGradient();
    track.classList.toggle('progress-track--gradient', blocky && gradient);

    if (blocky) {
      resizeObserver?.disconnect();
      buildSegments();
      resizeObserver = new ResizeObserver(() => {
        if (rebuildTimer) clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(buildSegments, 50);
      });
      resizeObserver.observe(track);
    } else {
      bar = track.querySelector<HTMLElement>('.progress-bar');
      updateBar(getValue());
    }
  }

  function update(value: number) {
    if (isBlocky()) updateSegments(value);
    else updateBar(value);
  }

  function destroy() {
    resizeObserver?.disconnect();
    if (rebuildTimer) clearTimeout(rebuildTimer);
  }

  return { update, rebuild, destroy };
}
