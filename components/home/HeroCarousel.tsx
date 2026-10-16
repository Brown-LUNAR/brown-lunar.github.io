"use client";

import { useState, useEffect } from "react";
import { withBasePath } from "@/lib/basePath";

const SLIDES = [
  { src: withBasePath("/images/pic2.JPG"), alt: "Lab photo 1" },
  { src: withBasePath("/images/pic1.JPG"), alt: "Lab photo 2" },
  { src: withBasePath("/images/pic3.JPG"), alt: "Lab photo 3" },
  { src: withBasePath("/images/pic4.JPG"), alt: "Lab photo 4" },
  { src: withBasePath("/images/pic5.JPG"), alt: "Lab photo 5" },
];

const INTERVAL_MS = 5000;

function LunarDots({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const dots = [
    // moon1 left
    (isActive: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" fill={isActive ? "#F9E4C8" : "#323C50"} />
        <path
          d="M5.19043 0.363281C3.26147 1.72041 2 3.96226 2 6.5C2 10.6421 5.35786 14 9.5 14C10.3057 14 11.0811 13.8709 11.8086 13.6357C10.5891 14.4937 9.10431 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 4.16383 2.17855 1.33727 5.19043 0.363281Z"
          fill={isActive ? "#323C50" : "#F9E4C8"}
        />
      </svg>
    ),
    // moon2
    (isActive: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" fill={isActive ? "#F9E4C8" : "#323C50"} />
        <path
          d="M7.5 0C7.78731 0 8.07071 0.0173766 8.34961 0.0488281C6.90302 1.41608 6 3.35242 6 5.5C6 9.35446 8.90788 12.5277 12.6494 12.9502C11.3059 14.22 9.49454 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0Z"
          fill={isActive ? "#323C50" : "#F9E4C8"}
        />
      </svg>
    ),
    // full circle
    (isActive: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" fill={isActive ? "#F9E4C8" : "#323C50"} />
      </svg>
    ),
    // moon2 mirrored
    (isActive: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" transform="matrix(-1 0 0 1 15 0)" fill={isActive ? "#F9E4C8" : "#323C50"} />
        <path
          d="M7.5 0C7.21269 0 6.92929 0.0173766 6.65039 0.0488281C8.09698 1.41608 9 3.35242 9 5.5C9 9.35446 6.09212 12.5277 2.35059 12.9502C3.6941 14.22 5.50546 15 7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0Z"
          fill={isActive ? "#323C50" : "#F9E4C8"}
        />
      </svg>
    ),
    // moon1 mirrored
    (isActive: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" transform="matrix(-1 0 0 1 15 0)" fill={isActive ? "#F9E4C8" : "#323C50"} />
        <path
          d="M9.80957 0.363281C11.7385 1.72041 13 3.96226 13 6.5C13 10.6421 9.64214 14 5.5 14C4.69426 14 3.91885 13.8709 3.19141 13.6357C4.41088 14.4937 5.89569 15 7.5 15C11.6421 15 15 11.6421 15 7.5C15 4.16383 12.8215 1.33727 9.80957 0.363281Z"
          fill={isActive ? "#323C50" : "#F9E4C8"}
        />
      </svg>
    ),
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {dots.map((Dot, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show lab photo ${i + 1}`}
          aria-current={active === i}
          className="hero-dot"
        >
          {Dot(active === i)}
        </button>
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // Picking a dot should show that slide for a full interval, not the remainder of the current one.
  function goToSlide(index: number) {
    setCurrent(index);
    setTimerKey((key) => key + 1);
  }

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [paused, timerKey]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1243,
        aspectRatio: "1243 / 492",
        maxHeight: 492,
        marginTop: "clamp(24px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
        background: "#D9D9D9",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: current === i ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <LunarDots active={current} onSelect={goToSlide} />
      </div>
    </div>
  );
}
