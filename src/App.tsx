import Hero from "./components/Hero";
import SkillSection from "./components/SkillSection";
import { FadeIn } from "./components/helpers/FadeIn";
import { lazy, Suspense, useMemo } from "react";
import QuoteSection from "./components/QuoteSection";
import ContactSection from "./components/ContactSection";
import ThemeToggle from "./components/ThemeToggle";
import SideNav from "./components/SideNav";
import {
  type TocProgressItem,
} from "./components/arc/toc-progress";
import { usesCategoryId, usesData } from "./data/uses";
import { projects } from "./data/projects";
import { blogs } from "./data/blog";
import { openSourceProjects } from "./data/opensource";
import {
  blogSectionId,
  openSourceSectionId,
  projectSectionId,
} from "./lib/section-id";

const ProjectSection = lazy(() => import("./components/ProjectSection"));
const OpenSourceSection = lazy(() => import("./components/OpenSourceSection"));
const BlogSection = lazy(() => import("./components/BlogSection"));
const UsesSection = lazy(() => import("./components/UsesSection"));
const Stats = lazy(() => import("./components/Stats"));

const SectionFallback = () => (
  <div className="h-40 animate-pulse bg-muted/20 rounded-xl" />
);

const App = () => {
  const tocItems: TocProgressItem[] = useMemo(
    () => [
      { id: "home", label: "Главная", level: 1 },
      { id: "skills", label: "Технологии", level: 1 },
      { id: "projects", label: "Проекты", level: 1 },
      ...projects.map((project) => ({
        id: projectSectionId(project.name),
        label: project.name,
        level: 2 as const,
      })),
      { id: "opensource", label: "Open Source", level: 1 },
      ...openSourceProjects.map((project) => ({
        id: openSourceSectionId(project.slug),
        label: project.name,
        level: 2 as const,
      })),
      { id: "blogs", label: "Блоги", level: 1 },
      ...blogs.map((blog) => ({
        id: blogSectionId(blog.slug),
        label: blog.title,
        level: 2 as const,
      })),
      { id: "uses", label: "Инструменты", level: 1 },
      ...usesData.map((category) => ({
        id: usesCategoryId(category.id),
        label: category.title,
        level: 2 as const,
      })),
      { id: "stats", label: "Активность на GitHub", level: 1 },
      { id: "quote", label: "Цитата", level: 1 },
      { id: "contact", label: "Контакты", level: 1 },
    ],
    [],
  );

  return (
    <div className="min-h-screen text-foreground relative">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 py-8 sm:gap-24 sm:py-12">
        <div className="flex justify-end lg:hidden">
          <div className="w-36">
            <ThemeToggle />
          </div>
        </div>

        <main className="flex min-w-0 flex-col gap-20 sm:gap-24">
          <Hero />
          <FadeIn>
            <SkillSection />
          </FadeIn>
          <Suspense fallback={<SectionFallback />}>
            <FadeIn>
              <ProjectSection />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FadeIn>
              <OpenSourceSection />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FadeIn>
              <BlogSection />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FadeIn>
              <UsesSection />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FadeIn>
              <Stats />
            </FadeIn>
          </Suspense>
          <Suspense
            fallback={
              <div className="h-24 animate-pulse bg-muted/20 rounded-xl" />
            }
          >
            <FadeIn>
              <QuoteSection />
            </FadeIn>
          </Suspense>
          <FadeIn>
            <ContactSection />
          </FadeIn>
          {/* Let Contact reach the TOC reading line at max scroll. */}
          <div className="h-[40vh]" aria-hidden="true" />
        </main>
      </div>

      <SideNav items={tocItems} />
    </div>
  );
};

export default App;
