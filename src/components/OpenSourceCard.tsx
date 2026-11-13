import type { OpenSourceProject } from "@/data/opensource";
import { CircleDot, GitPullRequest } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContributionList from "@/components/ContributionList";
import { ExpandableCard } from "@/components/arc/expandable-card";
import { openSourceSectionId } from "@/lib/section-id";
import { outboundHref } from "@/lib/outbound";
import { asset } from "@/lib/asset";

type OpenSourceCardProps = {
  project: OpenSourceProject;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

const OpenSourceCard = ({
  project,
  expanded,
  onExpandedChange,
}: OpenSourceCardProps) => {
  const total = project.prs.length + project.issues.length;

  return (
    <div id={openSourceSectionId(project.slug)} className="scroll-mt-8">
      <ExpandableCard
        title={project.name}
        description={project.description}
        expanded={expanded}
        onExpandedChange={onExpandedChange}
        header={
          <span className="flex w-full items-stretch gap-3">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-border p-1 sm:h-24 sm:w-24">
              <img
                src={asset(project.logoLight)}
                alt={project.name}
                loading="lazy"
                className="h-full w-full object-contain dark:hidden"
              />
              <img
                src={asset(project.logoDark)}
                alt={project.name}
                loading="lazy"
                className="hidden h-full w-full object-contain dark:block"
              />
            </span>
            <span className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-0.5">
              <strong className="text-lg font-light tracking-tight text-foreground leading-tight">
                {project.name}
              </strong>
              <span className="line-clamp-2 text-sm font-light leading-snug text-muted-foreground">
                {project.description}
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs tracking-wide text-muted-foreground/70">
                  <GitPullRequest className="h-3 w-3" />
                  {project.prs.length} PR
                </span>
                <span className="h-2.5 w-px bg-border/60" />
                <span className="flex items-center gap-1 text-xs tracking-wide text-muted-foreground/70">
                  <CircleDot className="h-3 w-3" />
                  {project.issues.length} issue
                </span>
              </span>
            </span>
          </span>
        }
      >
        <div className="space-y-5 text-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border/60 bg-muted/30 px-2.5 py-1 text-xs tracking-wide text-muted-foreground">
              <GitPullRequest className="h-3 w-3 text-purple-500" />
              {project.prs.length} pull request
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border/60 bg-muted/30 px-2.5 py-1 text-xs tracking-wide text-muted-foreground">
              <CircleDot className="h-3 w-3 text-emerald-500" />
              {project.issues.length} issue
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border/60 bg-muted/30 px-2.5 py-1 text-xs tracking-wide text-muted-foreground">
              всего {total}
            </span>
            <a
              href={outboundHref(project.link)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Репозиторий →
            </a>
          </div>

          <Tabs defaultValue="prs" className="w-full">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger
                value="prs"
                className="flex-none px-3.5 text-sm font-normal sm:px-4 sm:text-base"
              >
                Pull request’ы ({project.prs.length})
              </TabsTrigger>
              <TabsTrigger
                value="issues"
                className="flex-none px-3.5 text-sm font-normal sm:px-4 sm:text-base"
              >
                Issues ({project.issues.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prs" className="mt-4">
              <ContributionList items={project.prs} type="pr" />
            </TabsContent>
            <TabsContent value="issues" className="mt-4">
              <ContributionList items={project.issues} type="issue" />
            </TabsContent>
          </Tabs>
        </div>
      </ExpandableCard>
    </div>
  );
};

export default OpenSourceCard;
