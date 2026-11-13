import { FadeIn } from "@/components/helpers/FadeIn";
import { socials } from "@/data/socials";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import { outboundHref } from "@/lib/outbound";
import { asset } from "@/lib/asset";

const ContactSection = () => {
  const { resolvedTheme } = useTheme();

  return (
    <section id="contact" className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div className="flex flex-col gap-6 justify-center">
          <FadeIn delay={0.05}>
            <h2 className="text-2xl font-light tracking-tight sm:text-3xl">
              Давайте знакомиться
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-light">
              Всегда открыт к обсуждению новых проектов, креативных идей и
              возможностей стать частью ваших замыслов. Есть вопрос или просто
              хотите поздороваться — пишите!
            </p>
          </FadeIn>
        </div>

        <div className="flex flex-col gap-3 justify-center">
          {socials.map((social, index) => (
            <FadeIn key={social.name} delay={0.15 + index * 0.05}>
              <a
                href={outboundHref(social.href)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-dashed border-border/80 bg-card p-4 transition-all hover:border-foreground/30 hover:bg-muted/20"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={asset(
                      resolvedTheme === "dark" && social.darkIcon
                        ? social.darkIcon
                        : social.icon,
                    )}
                    alt={social.name}
                    className="h-6 w-6 rounded-sm object-contain"
                  />
                  <span className="text-base font-light tracking-tight">
                    {social.name}
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
