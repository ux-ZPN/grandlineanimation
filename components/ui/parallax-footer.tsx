"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import HalftoneWordmarkFooter, {
  HalftoneWordmarkFooterProps,
} from "@/components/ui/halftone-wordmark-footer";

export default function ParallaxFooter(props: HalftoneWordmarkFooterProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Track scroll precisely as the footer scrolls into the viewport
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Smooth physics interpolation for responsive, tactile scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
    restDelta: 0.001,
  });

  // 1. Appear out of nothing: opacity begins at pure 0, blooms to 1 with scroll
  const opacity = useTransform(smoothProgress, [0.05, 0.75], [0, 1]);

  // 2. Atmospheric blur dissipates: clears from cloud haze into sharp clarity
  const blur = useTransform(
    smoothProgress,
    [0.05, 0.75],
    reduce ? ["blur(0px)", "blur(0px)"] : ["blur(20px)", "blur(0px)"]
  );

  // 3. Scale focus: emerges from spatial depth (0.96 -> 1.0) without any pull-out drawer slide
  const scale = useTransform(
    smoothProgress,
    [0.05, 0.85],
    reduce ? [1, 1] : [0.96, 1]
  );

  // 4. Subtle micro-float (only 20px, NOT a 110% pull out)
  const y = useTransform(
    smoothProgress,
    [0, 1],
    reduce ? ["0px", "0px"] : ["20px", "0px"]
  );

  // 5. Soft ambient horizon aura blooming behind the glass as it forms
  const glowOpacity = useTransform(
    smoothProgress,
    [0.05, 0.65, 1],
    [0, 0.7, 0.2]
  );

  // 6. Hairline border sheen accent
  const borderSheen = useTransform(
    smoothProgress,
    [0.1, 0.75],
    [0, 0.5]
  );

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full overflow-hidden"
    >
      {/* Soft atmospheric horizon glow blooming out of nothing */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[400px] bg-radial from-sky-400/20 via-sky-500/5 to-transparent blur-3xl z-0"
        style={{ opacity: glowOpacity }}
      />

      {/* Subtle horizon light beam along the top rim */}
      <motion.div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[1.5px] bg-gradient-to-r from-transparent via-sky-300 to-transparent blur-[1px] z-20"
        style={{ opacity: borderSheen }}
      />

      {/* The Parallax Footer: appearing out of nothing right in place */}
      <motion.div
        className="relative z-10 w-full border-t border-white/15 backdrop-blur-[2px] origin-bottom will-change-transform"
        style={{
          opacity,
          filter: blur,
          scale,
          y,
        }}
      >
        <HalftoneWordmarkFooter {...props} />
      </motion.div>
    </footer>
  );
}
