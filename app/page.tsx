import { CloudShader } from "@/components/ui/cloud-shader";
import SpatialDepthHero from "@/components/ui/spatial-depth-hero";
import ParallaxFooter from "@/components/ui/parallax-footer";

export default function Page() {
  return (
    <main className="relative w-full min-h-screen bg-slate-950">
      {/* Unified Continuous Cloud Animation across entire page and footer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <CloudShader
          className="h-full w-full"
          speed={1.0}
          count={6}
          scrollDriven={true}
        />
      </div>

      {/* 1. Spatial Depth 3D Hero Section (400vh scroll) */}
      <SpatialDepthHero />

      {/* 2. Parallax Emergence Footer with continuous cloud background */}
      <ParallaxFooter
        wordmark="grandline"
        label="Grandline Studio"
        meta="©2026 · Grandline Studio"
        crop={0}
        yOffset={15}
        preset="night"
        palette={{
          background: "rgba(10, 22, 45, 0.4)",
          ink: "#ffffff",
          warm: "#38bdf8",
        }}
      />
    </main>
  );
}
