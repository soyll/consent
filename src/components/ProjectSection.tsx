import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import ComingSoonCard, { ComingSoonCardWide } from "./ComingSoonCard";
import { Button } from "@/components/ui/button";
import TechIcon from "@/components/helpers/TechIcon";
import { projectSectionId } from "@/lib/project-id";
import { outboundHref } from "@/lib/outbound";
import { asset } from "@/lib/asset";
import { BiLink } from "react-icons/bi";
import { LuGithub } from "react-icons/lu";

const ProjectSection = () => {
  const isEven = projects.length % 2 === 0;

  return (
    <div className="flex w-full flex-col gap-20 sm:gap-24">
      <section id="projects" className="w-full space-y-6">
        <h2 className="text-2xl font-light tracking-tight sm:text-3xl">
          Проекты
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
          {isEven ? <ComingSoonCardWide /> : <ComingSoonCard />}
        </div>
      </section>

      {projects.map((project) => (
        <section
          key={project.name}
          id={projectSectionId(project.name)}
          className="w-full space-y-6 scroll-mt-8"
        >
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-light tracking-tight sm:text-3xl">
              {project.name}
            </h3>
            <p className="text-lg font-light text-muted-foreground sm:text-xl">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href={outboundHref(project.githubLink)}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                className="border border-border border-dashed"
                size="lg"
              >
                <LuGithub className="w-4 h-4" />
                Исходный код
              </Button>
            </a>
            <a
              href={outboundHref(project.liveLink)}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg">
                <BiLink className="w-4 h-4" />
                Демо
              </Button>
            </a>
          </div>

          <img
            className="rounded-lg border border-border border-dashed"
            src={asset(project.imgSrc)}
            alt={project.name}
            loading="lazy"
          />

          <div>
            <h4 className="mb-4 text-xl font-light tracking-tight sm:text-2xl">
              Технологии
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech.name}
                  className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-1 py-1.5 text-xs text-foreground sm:px-3.5 sm:text-sm"
                >
                  <TechIcon item={tech} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-light tracking-tight sm:text-2xl">
              О проекте
            </h4>
            <p className="font-light text-muted-foreground">{project.about}</p>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-light tracking-tight sm:text-2xl">
              Ключевые возможности
            </h4>
            <ul className="list-disc space-y-2 pl-5 font-light text-muted-foreground">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProjectSection;
