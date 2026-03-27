import React from "react";

/**
 * Shared "backroom" background used by:
 * - initialize-ouvre welcome screen (logo/start screen background)
 * - owner-access password screen background
 *
 * NOTE: This component renders ONLY background/effects (no buttons/UI controls).
 */
export function OuvreBackroomBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      {/* Background image */}
      <img
        src="/landing.jpg"
        alt=""
        className="w-full h-full object-cover object-center select-none pointer-events-none"
      />

      {/* Small center gif */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[100px] h-[70px] video-feather">
        <img
          src="/video3.gif"
          alt=""
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </div>

      {/* Scanlines + unstable noise + light sweep overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanlines" />
        <div className="noise" />
        <div className="light" />
      </div>

      <style jsx>{`
        .scanlines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.085) 0px,
            rgba(255, 255, 255, 0.085) 1px,
            rgba(0, 0, 0, 0.22) 2px,
            rgba(0, 0, 0, 0.22) 4px
          );
          opacity: 0.58;
          mix-blend-mode: overlay;
          animation: scanMove 0.22s linear infinite, scanFlicker 1.1s steps(2) infinite;
        }

        .noise {
          position: absolute;
          inset: 0;
          opacity: 0.42;
          mix-blend-mode: overlay;
          background-size: 160px 160px;
          filter: contrast(200%) brightness(135%) saturate(125%);
          background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.95'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'%20opacity='.65'/%3E%3C/svg%3E");
          animation: noiseShift 0.35s steps(2) infinite, noiseFlicker 0.9s steps(3) infinite;
        }

        /* Second noise layer to feel more "alive". */
        .noise::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.55;
          mix-blend-mode: overlay;
          background-size: 120px 120px;
          filter: contrast(220%) brightness(150%);
          background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n2'%3E%3CfeTurbulence%20type='turbulence'%20baseFrequency='.75'%20numOctaves='4'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n2)'%20opacity='.7'/%3E%3C/svg%3E");
          animation: noiseShift2 0.45s steps(2) infinite;
        }

        .light {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.08) 45%,
            rgba(255, 255, 255, 0) 60%
          );
          opacity: 0.68;
          mix-blend-mode: screen;
          filter: blur(0.2px);
          animation: lightSweep 2.35s ease-in-out infinite, lightFlicker 1.4s steps(3) infinite;
        }

        @keyframes scanMove {
          0% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(4px);
          }
        }

        @keyframes scanFlicker {
          0% {
            opacity: 0.52;
          }
          50% {
            opacity: 0.66;
          }
          100% {
            opacity: 0.56;
          }
        }

        @keyframes noiseShift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(-3%, 1.5%, 0);
          }
          50% {
            transform: translate3d(2%, -2.5%, 0);
          }
          75% {
            transform: translate3d(3%, 2.5%, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes noiseShift2 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(2%, 1%, 0);
          }
          50% {
            transform: translate3d(-2%, -1.5%, 0);
          }
          75% {
            transform: translate3d(-3%, 2%, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes lightSweep {
          0% {
            transform: translateX(-12%);
          }
          50% {
            transform: translateX(12%);
          }
          100% {
            transform: translateX(-12%);
          }
        }

        @keyframes lightFlicker {
          0% {
            opacity: 0.6;
          }
          35% {
            opacity: 0.78;
          }
          70% {
            opacity: 0.62;
          }
          100% {
            opacity: 0.7;
          }
        }

        /* Feathered edges for the small video */
        .video-feather {
          -webkit-mask-image: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 1) 60%,
            rgba(0, 0, 0, 0) 78%
          );
          mask-image: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 1) 60%,
            rgba(0, 0, 0, 0) 78%
          );
        }
      `}</style>
    </div>
  );
}

