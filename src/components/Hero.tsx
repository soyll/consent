import { useState, useEffect } from "react";
import { BadgeCheck, BookText, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import TechIcon from "./helpers/TechIcon";
import { skills } from "@/data/tech";
import { socials } from "@/data/socials";
import SocialIcon from "./helpers/SocialIcon";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/motionVariants";
import { scrollToSectionId } from "@/lib/scroll-to";
import { outboundHref } from "@/lib/outbound";

const LABELS = ["FullStack-разработчик", "Не ИИ-разработчик"];

const Hero = () => {
  const [labelIdx, setLabelIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setLabelIdx((i) => (i + 1) % LABELS.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="flex flex-col justify-center pt-10 pb-16 sm:pt-6 sm:pb-12" id="home">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5 sm:space-y-10"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center mb-8 gap-[14px] sm:gap-[20px]"
        >
          <div className="flex shrink-0 items-center justify-center will-change-[transform,opacity] transform-gpu">
            {/* avatar */}
            <img
              src={`${import.meta.env.BASE_URL}images/avatar.jpg`}
              alt="Charan Munur"
              decoding="async"
              className="block h-35 w-35 shrink-0 rounded-full border-2 border-border object-cover object-center p-1 shadow-sm sm:h-40 sm:w-40"
            />
          </div>
          <div className="flex h-full flex-col justify-center gap-2 sm:gap-3">
            <h1 className="flex items-center gap-2 text-2xl font-normal tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Charan Munur
              <span className="text-background shrink-0">
                <BadgeCheck color="currentColor" fill="#3b82f6" size={24} />
              </span>
            </h1>
            <div className="flex items-start gap-2.5 sm:gap-3">
              {socials.map(({ name, icon, darkIcon, href }) => (
                <a
                  key={name}
                  href={outboundHref(href)}
                  target="_blank"
                  rel="noreferrer"
                  className="border-0 hover:opacity-80 transition-opacity"
                >
                  <SocialIcon
                    icon={icon}
                    darkIcon={darkIcon}
                    alt={name}
                    className="h-6 w-6 rounded p-0.5 sm:h-7 sm:w-7"
                  />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-5 sm:space-y-6">
          <h1 className="max-w-full text-[1.7rem] font-normal tracking-tight leading-tight sm:text-[2.05rem] md:text-[2.15rem]">
            <span style={{ display: "inline-grid" }}>
              <span style={{ visibility: "hidden", gridArea: "1/1" }} aria-hidden>
                {LABELS.reduce((a, b) => (a.length >= b.length ? a : b))}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={labelIdx}
                  style={{ gridArea: "1/1" }}
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                >
                  {LABELS[labelIdx]}
                  {labelIdx === 1 && (
                    <span className="text-[0.8em] ml-1.5">🤍</span>
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
            {" - "}
            <span className="text-[0.85em] font-light text-muted-foreground sm:text-[0.90em]">
              разбираюсь, как системы работают на самом деле и как пишется чистый код
            </span>
          </h1>
          <p className="text-base font-light leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Собираю бэкенд-системы и аккуратные интерфейсы на{" "}
            <span className="inline items-center gap-2 align-middle">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-foreground/30"
                >
                  <TechIcon item={skill} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {skill.name}
                </span>
              ))}
            </span>{" "}
            — с вниманием к деталям и адаптивности. Заодно из любопытства изучаю блокчейн.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSectionId("contact");
              }}
            >
              <Button size="lg">
                Связаться
                <ChevronRight strokeWidth={2.25} />
              </Button>
            </a>
            <a
              href={outboundHref(
                "https://drive.google.com/file/d/1AF0owusJPd1yf1vRwCJcaex04pnEVL_H/view?usp=sharing",
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="lg" className="bg-card border-dashed">
                Резюме
                <BookText />
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

