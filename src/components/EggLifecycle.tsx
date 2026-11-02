"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL = "/video/lifecycle.mp4";

/**
 * Each panel's scroll cue, in 0..1 progress through the section:
 * [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd].
 * The gaps between panels are dead zones (video only), so two panels are never readable together.
 * The last panel's fade-out lies beyond 1, so it holds until the section ends.
 */
const CUES = [
  [0.0, 0.0, 0.14, 0.2],
  [0.28, 0.36, 0.48, 0.56],
  [0.64, 0.72, 0.8, 0.86],
  [0.92, 0.97, 1.1, 1.2],
] as const;

const DRIFT = 22;

const panels = [
  {
    eyebrow: "From the very beginning",
    title: ["Every journey", "starts with an egg."],
    body: "Carefully nurtured from the start, every life begins with the right foundation.",
    cta: { href: "#story", label: "See how it begins" },
  },
  {
    eyebrow: "The next chapter",
    title: ["A little life.", "A big beginning."],
    body: "With the right care and environment, a new life emerges and takes its first steps.",
    cta: { href: "#farms", label: "Visit our farms" },
  },
  {
    eyebrow: "Growth & care",
    title: ["Growing with care,", "every day."],
    body: "From a tiny chick to a healthy adult bird, every stage matters.",
    cta: { href: "#why", label: "Why farmers choose GBR" },
  },
  {
    eyebrow: "The full journey",
    title: ["From the first shell to a future", "full of possibilities."],
    body: "",
    cta: { href: "#contact", label: "Partner with us" },
  },
] as const;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (p: number, a: number, b: number) => (b <= a ? (p >= b ? 1 : 0) : smooth(clamp((p - a) / (b - a), 0, 1)));

/**
 * Scroll-scrubbed "egg to hen" lifecycle. The section is a tall scroll track with a sticky stage inside;
 * page scroll progress through the track maps directly onto the video's currentTime.
 */
export function EggLifecycle() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const clip = videoRef.current;
    const meter = meterRef.current;
    const loader = loaderRef.current;
    const loaderBar = loaderBarRef.current;
    if (!track || !stage || !clip || !meter || !loader || !loaderBar) return;

    let progress = 0;
    let seekTo = 0;
    let seekAt = 0;
    let duration = 0;
    let ready = false;
    let inView = false;
    let raf = 0;
    let loadStarted = false;
    let disposed = false;
    let objectUrl: string | null = null;
    const controller = new AbortController();

    const readScroll = () => {
      const rect = track.getBoundingClientRect();
      const travel = rect.height - stage.clientHeight;
      progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
      if (duration) seekTo = progress * duration;
    };

    const paint = () => {
      meter.style.transform = `scaleX(${progress})`;
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const c = CUES[i];
        const enter = ramp(progress, c[0], c[1]);
        const leave = ramp(progress, c[2], c[3]);
        const o = enter * (1 - leave);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0,${(1 - enter) * DRIFT - leave * DRIFT}px,0)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });
    };

    // Ease the playhead toward the scroll target so scrubbing feels smooth rather than steppy.
    const frame = () => {
      if (ready && duration) {
        const gap = seekTo - seekAt;
        if (Math.abs(gap) > 0.0008) {
          seekAt += gap * 0.115;
          if (clip.readyState >= 2 && !clip.seeking) {
            try {
              clip.currentTime = seekAt;
            } catch {}
          }
        }
      }
      paint();
      raf = requestAnimationFrame(frame);
    };

    const setLoad = (f: number) => {
      loaderBar.style.transform = `scaleX(${f})`;
    };

    const start = () => {
      if (ready) return;
      ready = true;
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      readScroll();
      seekAt = seekTo;
    };

    const attach = (src: string) => {
      clip.addEventListener("loadedmetadata", () => {
        duration = clip.duration || 0;
        clip.pause();
        readScroll();
        seekAt = seekTo;
        try {
          clip.currentTime = seekAt;
        } catch {}
      });
      clip.addEventListener("loadeddata", start);
      clip.addEventListener("canplaythrough", start);
      clip.addEventListener("error", start);
      clip.src = src;
      clip.load();
      setTimeout(start, 12000);
    };

    // Fetch the mp4 as a fully buffered blob: seeking inside a blob is near-instant,
    // whereas range requests over the network make scrubbing stutter.
    const load = async () => {
      if (loadStarted) return;
      loadStarted = true;
      const bail = setTimeout(() => {
        controller.abort();
      }, 15000);
      try {
        const res = await fetch(VIDEO_URL, { signal: controller.signal });
        if (!res.ok || !res.body) throw new Error("fetch failed");
        const total = parseInt(res.headers.get("content-length") || "0", 10);
        const reader = res.body.getReader();
        const chunks: Uint8Array<ArrayBuffer>[] = [];
        let got = 0;
        for (;;) {
          const r = await reader.read();
          if (r.done) break;
          chunks.push(r.value as Uint8Array<ArrayBuffer>);
          got += r.value.length;
          setLoad(total ? got / total : Math.min(got / 2e6, 0.95));
        }
        clearTimeout(bail);
        if (disposed) return;
        setLoad(1);
        objectUrl = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
        attach(objectUrl);
      } catch {
        clearTimeout(bail);
        if (disposed) return;
        setLoad(1);
        attach(VIDEO_URL);
      }
    };

    // Only fetch the video as the section nears the viewport, and only run the render loop while it is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void load();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(track);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !raf) {
          readScroll();
          raf = requestAnimationFrame(frame);
        } else if (!inView && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "0px" },
    );
    visibility.observe(track);

    // iOS won't paint a video frame until the element has been played once, so nudge it on first interaction.
    const unlock = () => {
      const p = clip.play();
      if (p && typeof p.then === "function") p.then(() => clip.pause()).catch(() => {});
      else clip.pause();
    };
    const unlockEvents = ["touchstart", "pointerdown", "wheel", "keydown"] as const;
    unlockEvents.forEach((ev) => window.addEventListener(ev, unlock, { once: true, passive: true }));

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    readScroll();
    paint();

    return () => {
      disposed = true;
      controller.abort();
      io.disconnect();
      visibility.disconnect();
      if (raf) cancelAnimationFrame(raf);
      unlockEvents.forEach((ev) => window.removeEventListener(ev, unlock));
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section ref={trackRef} id="lifecycle" aria-label="The poultry lifecycle, from egg to hen" className="relative h-[520vh] min-h-[3200px] border-b border-line">
      <div ref={stageRef} className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden bg-paper">
        <video ref={videoRef} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-[1.02] object-cover" />

        {/* Paper-coloured veil keeps copy legible over the footage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(251_251_250/.7)_0%,rgb(251_251_250/.2)_24%,rgb(251_251_250/.2)_76%,rgb(251_251_250/.72)_100%),radial-gradient(100%_80%_at_50%_48%,rgb(251_251_250/0)_0%,rgb(251_251_250/.36)_100%)]"
        />

        {/* Scroll meter */}
        <div ref={meterRef} aria-hidden="true" className="absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 bg-brand/70" />

        {/* Panels */}
        <div className="pointer-events-none absolute inset-0">
          {panels.map((p, i) => (
            <div
              key={p.eyebrow}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-5 py-16 text-center opacity-0 will-change-[opacity,transform] sm:px-10"
            >
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand sm:text-[12px]">{p.eyebrow}</p>
              <h2 className="max-w-[16ch] text-balance text-[clamp(2rem,5.6vw,4.75rem)] font-medium leading-[1.02] tracking-tight text-ink">
                {p.title[0]}
                <br />
                <em className="font-serif font-normal italic">{p.title[1]}</em>
              </h2>
              {p.body && <p className="mt-5 max-w-[42ch] text-pretty text-[15px] leading-relaxed text-ink/70 sm:text-[17px]">{p.body}</p>}
              <div className="mt-8">
                <a href={p.cta.href} className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand">
                  {p.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Loader, shown until the clip is buffered */}
        <div ref={loaderRef} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper transition-[opacity,visibility] duration-700">
          <div className="h-px w-36 overflow-hidden bg-line">
            <div ref={loaderBarRef} className="h-full w-full origin-left scale-x-0 bg-ink" />
          </div>
          <p className="text-[12px] tracking-wider text-ink/45">Loading the journey…</p>
        </div>
      </div>
    </section>
  );
}
