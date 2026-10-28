// SVG filters behind the `ink-bleed` and `ink-stain` CSS utilities
// (globals.css). Rendered once in the root layout; takes no space.
//
// ink-bleed: roughens the glyph edges with noise, softens them, then
// re-thresholds the alpha so the letters look slightly swollen and blotted,
// like ink soaking into paper.
// ink-stain: the same bleed, plus a faint sideways smear and blotchy stains
// and specks scattered in a halo around the letters, in the text's color.
export default function InkBleedFilter() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      className="absolute pointer-events-none"
    >
      <filter
        id="ink-bleed"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        colorInterpolationFilters="sRGB"
      >
        {/* Fibrous "paper" noise that drags the edges around. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="1.5"
          xChannelSelector="R"
          yChannelSelector="G"
          result="rough"
        />
        {/* Spread, then a steep alpha curve: the blur halo becomes solid
            ink a little outside the original edge. */}
        <feGaussianBlur in="rough" stdDeviation="0.45" result="spread" />
        <feComponentTransfer in="spread">
          <feFuncA type="table" tableValues="0 0 0.3 1 1" />
        </feComponentTransfer>
      </filter>

      {/* Larger region than ink-bleed: the smear and stains reach outside
          the element's box. */}
      <filter
        id="ink-stain"
        x="-25%"
        y="-60%"
        width="150%"
        height="220%"
        colorInterpolationFilters="sRGB"
      >
        {/* 1. The bleed, as in ink-bleed. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed="7"
          result="fiber"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="fiber"
          scale="1.5"
          xChannelSelector="R"
          yChannelSelector="G"
          result="rough"
        />
        <feGaussianBlur in="rough" stdDeviation="0.45" result="spread" />
        <feComponentTransfer in="spread" result="ink">
          <feFuncA type="table" tableValues="0 0 0.3 1 1" />
        </feComponentTransfer>

        {/* 2. Smear: the ink dragged sideways, faint. */}
        <feGaussianBlur in="ink" stdDeviation="7 0.6" result="drag" />
        <feOffset in="drag" dx="4" dy="1" result="dragged" />
        <feComponentTransfer in="dragged" result="smear">
          <feFuncA type="linear" slope="0.35" />
        </feComponentTransfer>

        {/* 3. Where stains may appear: a soft halo around the letters. */}
        <feMorphology
          in="SourceAlpha"
          operator="dilate"
          radius="5"
          result="fat"
        />
        <feGaussianBlur in="fat" stdDeviation="6" result="halo" />

        {/* The ink's color, spread solid across the halo (alpha forced to
            1) so stains match the text in light and dark mode. */}
        <feGaussianBlur in="ink" stdDeviation="10" result="wash" />
        <feColorMatrix
          in="wash"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"
          result="inkColor"
        />

        {/* Blotches: low-frequency noise, hard-thresholded into patches. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.035"
          numOctaves="2"
          seed="3"
          result="blotNoise"
        />
        <feColorMatrix
          in="blotNoise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"
          result="blotAlpha"
        />
        <feComponentTransfer in="blotAlpha" result="blots">
          <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0.18 0.28" />
        </feComponentTransfer>

        {/* Specks: fine noise, only the rare peaks kept. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.6"
          numOctaves="1"
          seed="11"
          result="speckNoise"
        />
        <feColorMatrix
          in="speckNoise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 1 0 0 0"
          result="speckAlpha"
        />
        <feComponentTransfer in="speckAlpha" result="specks">
          <feFuncA
            type="discrete"
            tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0.7"
          />
        </feComponentTransfer>

        {/* Keep blotches and specks only inside the halo, then color them. */}
        <feMerge result="marks">
          <feMergeNode in="blots" />
          <feMergeNode in="specks" />
        </feMerge>
        <feComposite
          in="marks"
          in2="halo"
          operator="arithmetic"
          k1="1"
          k2="0"
          k3="0"
          k4="0"
          result="markMask"
        />
        <feComposite
          in="inkColor"
          in2="markMask"
          operator="in"
          result="stains"
        />

        {/* 4. Stains and smear under the lettering. */}
        <feMerge>
          <feMergeNode in="smear" />
          <feMergeNode in="stains" />
          <feMergeNode in="ink" />
        </feMerge>
      </filter>
    </svg>
  );
}
