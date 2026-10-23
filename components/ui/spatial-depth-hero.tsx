"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface ProjectItem {
  id?: string | number;
  title: string;
  src: string;
  fallback?: string;
  link: string;
  alt?: string;
  category?: string;
}

const IMG_BASE =
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/stack-spread";

export const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: "Kintsugi AI",
    src: "/projects/kintsugi.png",
    fallback: `${IMG_BASE}/img8.png`,
    link: "https://kintsugi-ai-phi.vercel.app/",
    alt: "Kintsugi AI - Four ways to rebuild how your business works",
  },
  {
    id: 2,
    title: "Celestial Dagger",
    src: "/projects/celestial-dagger.png",
    fallback: `${IMG_BASE}/img2.png`,
    link: "https://celestial-dagger.vercel.app/",
    alt: "Celestial Dagger - Brace For Impact",
  },
  {
    id: 3,
    title: "Meridian Exim",
    src: "/projects/meridian-exim.jpg",
    fallback: `${IMG_BASE}/img7.png`,
    link: "https://meridian-exim-demo-kgybrxu2v-grandline-studio.vercel.app/",
    alt: "Meridian Exim - We move India's finest to the world",
  },
  {
    id: 4,
    title: "Cove Parfums",
    src: "/projects/cove-parfums.png",
    fallback: `${IMG_BASE}/img3.png`,
    link: "https://cove-parfums.vercel.app/",
    alt: "Cove Parfums - Fragrance shaped by places that stay with us",
  },
  {
    id: 5,
    title: "WeGro Research",
    src: "/projects/wegro.png",
    fallback: `${IMG_BASE}/img5.png`,
    link: "https://wegro-gamma.vercel.app/",
    alt: "WeGro Research Analysts - Being right, honestly",
  },
  {
    id: 6,
    title: "The Little Heart",
    src: "/projects/the-little-heart.png",
    fallback: `${IMG_BASE}/img6.png`,
    link: "https://the-little-heart-mgvhsogfp-grandline-studio.vercel.app/",
    alt: "The Little Heart - Wholesome Tiffins, slow-Cooked With Love",
  },
  {
    id: 7,
    title: "AJRA",
    src: "/projects/ajra.png",
    fallback: `${IMG_BASE}/img1.png`,
    link: "https://www.ajra.shop/",
    alt: "AJRA - Made to be lived in",
  },
  {
    id: 8,
    title: "Max Sports",
    src: "/projects/max-sports.png",
    fallback: `${IMG_BASE}/img4.png`,
    link: "https://maxsportsstore.com/",
    alt: "Max Sports - Play Faster. Strike Sharper.",
  },
];

// Generate a 3D volumetric spread using Z-axis depth
const generateSpatialCards = (items: ProjectItem[] = PROJECTS) => {
  const spatialCoordinates = [
    { x: -28, y: -18, z: 250 }, // Front Left
    { x: 30, y: -22, z: 150 },  // Front Right High
    { x: -32, y: 20, z: 80 },   // Mid Left Low
    { x: 28, y: 18, z: -50 },   // Mid Right Low
    { x: -16, y: 28, z: -150 }, // Back Left Bottom
    { x: 18, y: -32, z: -250 }, // Back Right Top
    { x: -12, y: -30, z: -350 },// Deep Left Top
    { x: 12, y: 32, z: -450 },  // Deep Right Bottom
  ];

  return items.map((item, i) => {
    const coords = spatialCoordinates[i % spatialCoordinates.length];
    const rotateY = coords.x * -0.5;
    const rotateX = coords.y * 0.5;

    return {
      item,
      stacked: { x: 0, y: 0, z: i * 2, rotateZ: (i - 3.5) * 4, rotateY: 0, rotateX: 0 },
      spatial: {
        x: coords.x,
        y: coords.y,
        z: coords.z,
        rotateZ: (i - 3.5) * 1.5,
        rotateY,
        rotateX,
      },
    };
  });
};

const SCENE_SPRING = { stiffness: 40, damping: 30, mass: 1 };
const SCROLL_SPRING = { stiffness: 80, damping: 25, restDelta: 0.001 };

function useSceneParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, SCENE_SPRING);
  const tiltY = useSpring(rawY, SCENE_SPRING);

  useEffect(() => {
    if (!enabled || !active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientY / window.innerHeight - 0.5) * -15);
      rawY.set((e.clientX / window.innerWidth - 0.5) * 15);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, enabled, rawX, rawY]);

  return { tiltX, tiltY };
}

function SpatialCard({
  card,
  index,
  progress,
  isSpreadActive,
  hoveredIndex,
  setHoveredIndex,
}: {
  card: ReturnType<typeof generateSpatialCards>[0];
  index: number;
  progress: any;
  isSpreadActive: boolean;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const { item, stacked, spatial } = card;
  const [imgSrc, setImgSrc] = useState(item.src);

  useEffect(() => {
    setImgSrc(item.src);
  }, [item.src]);

  const xRaw = useTransform(progress, [0, 1], [stacked.x, spatial.x]);
  const yRaw = useTransform(progress, [0, 1], [stacked.y, spatial.y]);
  const z = useTransform(progress, [0, 1], [stacked.z, spatial.z]);

  const rotateZ = useTransform(progress, [0, 1], [stacked.rotateZ, spatial.rotateZ]);
  const rotateY = useTransform(progress, [0, 1], [stacked.rotateY, spatial.rotateY]);
  const rotateX = useTransform(progress, [0, 1], [stacked.rotateX, spatial.rotateX]);

  const scale = useTransform(progress, [0, 0.1, 1], [0, 0.65, 0.8]);
  const baseOpacity = useTransform(progress, [0, 0.1, 1], [0, 1, 1]);

  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

  const transform = useTransform(
    [xRaw, yRaw, z, rotateX, rotateY, rotateZ, scale] as any,
    ([tx, ty, tz, rx, ry, rz, s]: any[]) =>
      `translate3d(calc(-50% + ${tx}vw), calc(-50% + ${ty}vh), ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`
  );

  const isExternal = item.link?.startsWith("http");

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        zIndex: stacked.z,
        opacity: baseOpacity,
        width: "14vw",
        height: "20vh",
        transform: transform as any,
      }}
    >
      {/* 1. Deep Volumetric Cloud Cast Shadow (simulates shadow falling onto cloud layer) */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[2vw]"
        style={{
          transform: "translate3d(-8px, 38px, -60px) scale(0.92)",
          background:
            "radial-gradient(ellipse at center, rgba(12, 35, 68, 0.6) 0%, rgba(16, 44, 82, 0.35) 45%, transparent 75%)",
          filter: "blur(16px)",
        }}
        animate={{
          opacity: isDimmed ? 0.2 : 0.85,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* 2. Soft Ambient Occlusion under the card */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[1.8vw]"
        style={{
          transform: "translate3d(-3px, 18px, -25px) scale(0.98)",
          background: "rgba(8, 28, 56, 0.4)",
          filter: "blur(8px)",
        }}
      />

      {/* 3. The 3D Floating Physical Slab with Beveled Rim and Specular Sheen */}
      <motion.a
        href={item.link && item.link !== "#" ? item.link : undefined}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={item.title || item.alt}
        className="group block will-change-transform cursor-pointer pointer-events-auto relative h-full w-full rounded-[1.5vw] p-[1.5px] transition-all duration-500"
        style={{
          boxShadow: `
            0 2px 4px rgba(10, 25, 47, 0.25),
            0 14px 28px -6px rgba(8, 28, 58, 0.45),
            0 36px 72px -12px rgba(6, 22, 48, 0.5),
            inset 0 1.5px 1px rgba(255, 255, 255, 0.85),
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.35)
          `,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 40%, rgba(90,140,195,0.3) 100%)",
        }}
        onMouseEnter={() => isSpreadActive && setHoveredIndex(index)}
        onMouseLeave={() => isSpreadActive && setHoveredIndex(null)}
        animate={{
          opacity: isDimmed ? 0.35 : 1,
          filter: isDimmed ? "blur(6px) brightness(0.6)" : "blur(0px) brightness(1)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={
          isSpreadActive
            ? {
                scale: 1.1,
                rotateX: 0,
                rotateY: 0,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }
            : undefined
        }
      >
        <div className="relative h-full w-full overflow-hidden rounded-[calc(1.5vw-1.5px)] bg-slate-900/15 backdrop-blur-xs">
          {/* Top-right sunlight sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/35 z-10 pointer-events-none" />
          
          {/* Subtle bottom edge info bar on hover */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
            <span className="text-white text-[0.85vw] font-medium tracking-wide drop-shadow truncate">
              {item.title}
            </span>
            {item.link && item.link !== "#" && (
              <span className="text-[0.7vw] text-sky-300 font-semibold uppercase tracking-wider shrink-0 ml-1">
                ↗
              </span>
            )}
          </div>

          <img
            src={imgSrc}
            alt={item.alt || item.title}
            onError={() => item.fallback && setImgSrc(item.fallback)}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </motion.a>
    </motion.div>
  );
}

export default function SpatialDepthHero({
  projects = PROJECTS,
}: {
  projects?: ProjectItem[];
} = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [spread, setSpread] = useState(false);

  const cards = useMemo(() => generateSpatialCards(projects), [projects]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, SCROLL_SPRING);
  const progress = useTransform(smoothProgress, [0.08, 0.85], [0, 1]);

  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.8));

  const { tiltX, tiltY } = useSceneParallax(spread, !reduce);

  const textBlur = useTransform(progress, [0, 0.2, 0.85], ["blur(0px)", "blur(0px)", "blur(12px)"]);
  const textOpacity = useTransform(progress, [0, 0.2, 0.8], [1, 1, 0.2]);
  const textScale = useTransform(progress, [0, 0.85], [1, 0.8]);

  return (
    <section ref={wrapRef} className="relative w-full h-[300vh]">
      {/* Perspective Viewport - Sticky to keep in view during the 400vh scroll */}
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >

        {/* 3D Scene Container - Tilts the entire environment */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
        >
          {cards.map((card, i) => (
            <SpatialCard
              key={card.item.id || i}
              index={i}
              card={card}
              progress={progress}
              isSpreadActive={spread}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
        </motion.div>

        {/* Central Spatial Typography */}
        <motion.div
          className="pointer-events-none absolute z-[5] flex flex-col items-center text-center px-6"
          style={{
            opacity: textOpacity,
            scale: textScale,
            filter: textBlur,
            transform: "translateZ(0px)",
          }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 dark:bg-black/30 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
            <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-800 dark:text-slate-100">
              Grandline Studio
            </span>
          </div>
          <h2 className="text-[5vw] font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] max-md:text-[10vw]">
            Projects of Grandline Studio
          </h2>
          <p className="mt-4 max-w-[44ch] text-[1.15vw] font-medium leading-relaxed text-slate-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] max-md:text-[3.5vw]">
            Experience spatial layout scaling. Notice how assets physically drift
            through the cloud atmosphere, bringing life to the interface.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
