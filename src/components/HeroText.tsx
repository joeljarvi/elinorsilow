"use client";

export default function HeroText() {
  const heroBody =
    "(b. 1993, Malmö, Sweden) is a Stockholm-based artist working with painting, sculpture, and textile. Her work explores raw emotion through material, gesture, and form. For business inquiries, please contact Elinor Silow at: elinor.silow@gmail.com";

  return (
    <div className="font-timesNewRoman tracking-wide whitespace-normal max-w-4xl pt-8 mx-0 lg:mx-auto w-full ">
      <p className="text-foreground text-xl leading-[1.2] lg:leading-[1.1] lg:text-3xl text-left lg:text-center">
        {heroBody}
      </p>
    </div>
  );
}
