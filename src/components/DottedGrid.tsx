export default function DottedGrid() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-foreground"
      >
        <defs>
          <radialGradient
            id="dg-dot-grad"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="5%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          <pattern
            id="dg-dot-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="10" fill="url(#dg-dot-grad)" />
          </pattern>

          {/* <linearGradient id="dg-mask-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0" />
          </linearGradient> */}

          {/* <mask id="dg-fade-mask">
            <rect width="100%" height="100%" fill="url(#dg-mask-grad)" />
          </mask> */}
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#dg-dot-pattern)"
          mask="url(#dg-fade-mask)"
        />
      </svg>
    </div>
  );
}
