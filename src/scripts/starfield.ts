export function initStarfield(canvas: HTMLCanvasElement | null): (() => void) | void {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stars: { x: number; y: number; z: number; s: number }[] = [];
  let w = 0;
  let h = 0;
  let mx = 0;
  let my = 0;
  let raf = 0;

  const STAR_COUNT = 220;

  function onResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1 + 0.2,
        s: Math.random() * 1.6 + 0.3,
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const parallaxX = (mx / Math.max(w, 1) - 0.5) * 24;
    const parallaxY = (my / Math.max(h, 1) - 0.5) * 24;

    for (const st of stars) {
      st.y += st.z * 0.35;
      st.x += Math.sin(st.y * 0.002) * 0.15;
      if (st.y > h + 4) {
        st.y = -4;
        st.x = Math.random() * w;
      }
      const px = st.x + parallaxX * st.z;
      const py = st.y + parallaxY * st.z;
      const alpha = 0.25 + st.z * 0.55;
      ctx.beginPath();
      ctx.fillStyle = `rgba(230, 220, 255, ${alpha})`;
      ctx.arc(px, py, st.s * st.z, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  function onMove(e: MouseEvent) {
    mx = e.clientX;
    my = e.clientY;
  }

  onResize();
  seed();
  function handleResize() {
    onResize();
    seed();
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', onMove, { passive: true });
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', onMove);
  };
}
