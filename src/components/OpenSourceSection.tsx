import { useEffect, useState } from "react";
import { openSourceProjects } from "@/data/opensource";
import OpenSourceCard from "@/components/OpenSourceCard";
import {
  OpenSourceComingSoonCard,
  OpenSourceComingSoonCardWide,
} from "@/components/OpenSourceComingSoonCard";
import { openSourceSectionId } from "@/lib/section-id";
import { scrollToSectionId } from "@/lib/scroll-to";

const OpenSourceSection = () => {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const isEven = openSourceProjects.length % 2 === 0;

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const match = openSourceProjects.find(
        (p) => openSourceSectionId(p.slug) === hash,
      );
      if (match) {
        setOpenSlug(match.slug);
        requestAnimationFrame(() =>
          scrollToSectionId(openSourceSectionId(match.slug), {
            behavior: "smooth",
          }),
        );
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <section id="opensource" className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-light tracking-tight sm:text-3xl">
          Open Source
        </h2>
        <p className="text-base font-light text-muted-foreground sm:text-lg">
          Проекты и организации, в которые я вносил вклад через pull request’ы,
          баг-репорты и предложения фич.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {openSourceProjects.map((project) => (
          <OpenSourceCard
            key={project.slug}
            project={project}
            expanded={openSlug === project.slug}
            onExpandedChange={(next) => {
              setOpenSlug(next ? project.slug : null);
              if (next) {
                history.replaceState(
                  null,
                  "",
                  `#${openSourceSectionId(project.slug)}`,
                );
              } else if (
                window.location.hash ===
                `#${openSourceSectionId(project.slug)}`
              ) {
                history.replaceState(null, "", "#opensource");
              }
            }}
          />
        ))}

        {isEven ? <OpenSourceComingSoonCardWide /> : <OpenSourceComingSoonCard />}
      </div>
    </section>
  );
};

export default OpenSourceSection;
