import { LuGithub } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import TechIcon from "./helpers/TechIcon";
import type { Project } from "@/data/projects";
import { projectSectionId } from "@/lib/project-id";
import { outboundHref } from "@/lib/outbound";
import { asset } from "@/lib/asset";

function scrollToProject(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const root = document.getElementById("root");
  let scroller: HTMLElement | null = null;
  if (root) {
    for (const el of root.querySelectorAll<HTMLElement>("div")) {
      const style = window.getComputedStyle(el);
      if (
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 1
      ) {
        scroller = el;
        break;
      }
    }
  }

  if (scroller) {
    const top =
      target.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
            scroller.scrollTop -
            88;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  history.replaceState(null, "", `#${id}`);
}

const ProjectCard = ({
  name,
  imgSrc,
  description,
  techStack,
  liveLink,
  githubLink,
}: Project) => {
  const sectionId = projectSectionId(name);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => scrollToProject(sectionId)}
      onKeyDown={(e) => e.key === "Enter" && scrollToProject(sectionId)}
      className="group flex flex-col gap-2 bg-card border border-dashed border-border/80 p-1.5 rounded-xl w-full overflow-hidden hover:bg-muted/20 transition-all duration-200 cursor-pointer"
    >
      <div className="group/image rounded-lg overflow-hidden border border-border/80 bg-muted/30">
        <img
          src={asset(imgSrc)}
          alt={name}
          loading="lazy"
          className="rounded-lg w-full object-cover transition-all duration-500 ease-out group-hover/image:blur-xs"
        />
      </div>

      <div className="px-2 mt-4">
        <div className="text-xl font-light tracking-tight">{name}</div>
        <p className="mt-1 text-sm font-light text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4 px-2 mt-4">
        {techStack.slice(0, 8).map((tech) => (
          <TechIcon key={tech.name} item={tech} className="w-5 h-5" showTooltip />
        ))}
        {techStack.length > 8 && (
          <span className="text-sm text-muted-foreground font-light">
            +{techStack.length - 8}
          </span>
        )}
      </div>

      <div className="w-full h-px bg-border mt-2 mb-1" />

      <div className="flex items-center justify-between mt-1 px-2 pb-2">
        <a
          href={outboundHref(liveLink)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <BiLink className="w-4 h-4" />
          <span className="text-[15px] font-extralight">Демо</span>
        </a>
        <a
          href={outboundHref(githubLink)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <LuGithub className="w-4 h-4" />
          <span className="text-[15px] font-extralight">Github</span>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
