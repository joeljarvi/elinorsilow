import { Work, Exhibition } from "../../lib/sanity";

export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-baseline gap-x-3 py-1.5">
      <span className="font-universNextPro font-medium text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      {children}
    </div>
  );
}

function StaggerRow({
  label,
  value,
  index,
  revealed = false,
}: {
  label: string;
  value: React.ReactNode;
  index: number;
  revealed?: boolean;
}) {
  return (
    <div
      className={`flex flex-row gap-x-4 items-baseline transition-[opacity,transform] duration-150 ease-out ${
        revealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <span className="font-timesNewRoman text-[16px] text-muted-foreground shrink-0">
        {label}
      </span>
      <span className="font-timesNewRoman text-[16px] truncate lg:truncate-none">
        {value}
      </span>
    </div>
  );
}

export default function InfoBox({
  work,
  exhibition,
  revealed = false,
}: {
  work?: Work;
  exhibition?: Exhibition;
  revealed?: boolean;
}) {
  if (work) {
    const rows = [
      { label: "Title", value: work.title.rendered },
      { label: "Year", value: work.acf.year },
      { label: "Medium", value: work.acf.materials },
      { label: "Dimensions", value: work.acf.dimensions },
    ].filter((r) => r.value);

    return (
      <div className="py-1.5 flex flex-col w-full bg-background px-1.5">
        {rows.map((row, i) => (
          <StaggerRow
            key={row.label}
            label={row.label}
            value={row.value}
            index={i}
            revealed={revealed}
          />
        ))}
      </div>
    );
  }

  if (exhibition) {
    const location = [exhibition.acf.location, exhibition.acf.city]
      .filter(Boolean)
      .join(", ");

    const rows = [
      { label: "Title", value: exhibition.title.rendered },
      { label: "Year", value: exhibition.acf.year },
      { label: "Venue", value: location },
    ].filter((r) => r.value);

    return (
      <div className="py-1.5 flex flex-col w-full">
        {rows.map((row, i) => (
          <StaggerRow
            key={row.label}
            label={row.label}
            value={row.value}
            index={i}
            revealed={revealed}
          />
        ))}
      </div>
    );
  }

  return null;
}
