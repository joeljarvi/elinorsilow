function Corner() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M24 0.96L1 0.96L1 24L2.76562e-06 24L1.90735e-06 -1.04907e-06L24 0L24 0.96Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CornerFrame({
  padding = "inset-4",
}: {
  padding?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none text-[var(--border)] group-hover:text-foreground transition-colors duration-300 ${padding}`}
    >
      <div className="absolute top-0 left-0">
        <Corner />
      </div>
      <div className="absolute top-0 right-0 rotate-90">
        <Corner />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180">
        <Corner />
      </div>
      <div className="absolute bottom-0 left-0 -rotate-90">
        <Corner />
      </div>
    </div>
  );
}
