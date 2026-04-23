"use client";

import WigglyButton from "./WigglyButton";

export default function HeroText() {
  const heroStart = "Elinor Silow ";
  const heroBody =
    "(b. 1993, Malmö, Sweden) is a Stockholm-based artist working with painting, sculpture, and textile. Her work explores raw emotion through material, gesture, and form. For business inquiries, please contact Elinor Silow at: ";

  const heroTail = "elinor.silow@gmail.com ";

  return (
    <>
      <p className="font-timesNewRoman  leading-[1.2] tracking-wide whitespace-normal max-w-2xl">
        {heroStart && (
          <WigglyButton
            text={heroStart}
            className="inline-flex px-0 font-timesNewRoman align-baseline"
            size="text-[16px] leading-[1.2]"
            sizeGradient={{ from: 28, to: 16 }}
            wiggleGradient
            revealAnimation={false}
            active
          />
        )}
        {heroBody && (
          <span>
            {heroBody}{" "}
            <WigglyButton
              href="mailto:elinor.silow@gmail.com"
              className="p-0"
              text={heroTail}
              active
              wiggleGradient
            />
          </span>
        )}
      </p>
    </>
  );
}
