import { usesCategoryId, usesData } from "@/data/uses";
import { ArrowUpRight } from "lucide-react";
import { outboundHref } from "@/lib/outbound";

const UsesSection = () => {
  return (
    <section id="uses" className="w-full space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-light tracking-tight sm:text-3xl">Инструменты</h2>
        <p className="text-base text-muted-foreground font-light leading-relaxed">
          Железо, софт, редактор и инструменты, которыми пользуюсь каждый день.
        </p>
      </div>

      <div className="space-y-10">
        {usesData.map((category) => (
          <section
            key={category.id}
            id={usesCategoryId(category.id)}
            className="space-y-4"
          >
            <h3 className="text-xl font-light tracking-tight text-foreground sm:text-2xl">
              {category.title}
            </h3>

            <div className="space-y-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 py-2 border-b border-dashed border-border/40 last:border-0"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-light tracking-tight text-foreground">
                        {item.name}
                      </span>
                      {item.tag && (
                        <span className="text-[11px] font-light text-muted-foreground/60">
                          · {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.link && (
                    <a
                      href={outboundHref(item.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 sm:mt-0"
                    >
                      <span>Открыть</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default UsesSection;
