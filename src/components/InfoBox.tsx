import { Work, Exhibition } from "../../lib/sanity";

export function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-baseline gap-x-3 py-1.5">
      <span className="font-universNextPro font-medium text-[13px] text-muted-foreground shrink-0">{label}</span>
      {children}
    </div>
  );
}

export default function InfoBox({
  work,
  exhibition,
}: {
  work?: Work;
  exhibition?: Exhibition;
}) {
  if (work) {
    return (
      <div className="flex flex-wrap items-baseline gap-x-2 px-0 pb-2 text-[14px] font-universNextPro">
        <span className="font-bold tracking-wide font-timesNewRoman ">
          {work.title.rendered}
        </span>
        <span className="hidden lg:inline font-timesNewRoman ">
          {[work.acf.materials, work.acf.dimensions, work.acf.exhibition]
            .filter(Boolean)
            .join(", ")}
          ,
        </span>
        <span className="text-muted-foreground font-timesNewRoman italic  ">
          {work.acf.year}
        </span>
      </div>
    );
  }

  if (exhibition) {
    return (
      <div className="flex flex-wrap items-baseline gap-x-2 px-0 pb-2 text-[15px] font-universNextPro">
        <span className="font-extrabold font-universNextProExt">
          {exhibition.title.rendered},
        </span>
        <span className="hidden lg:inline text-muted-foreground">
          {[exhibition.acf.location, exhibition.acf.city]
            .filter(Boolean)
            .join(", ")}
        </span>
        <span className="text-muted-foreground">{exhibition.acf.year}</span>
      </div>
    );
  }

  return null;
}
