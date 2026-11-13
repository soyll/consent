import type { Blog } from "@/data/blog";
import { Clock, Tag } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExpandableCard } from "@/components/arc/expandable-card";
import { blogSectionId } from "@/lib/section-id";
import { outboundHref } from "@/lib/outbound";
import { asset } from "@/lib/asset";

type BlogCardProps = Blog & {
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

const BlogCard = ({
  slug,
  title,
  description,
  tags,
  date,
  readTime,
  content,
  expanded,
  onExpandedChange,
}: BlogCardProps) => {
  return (
    <div id={blogSectionId(slug)} className="scroll-mt-8">
      <ExpandableCard
        title={title}
        description={description}
        expanded={expanded}
        onExpandedChange={onExpandedChange}
        header={
          <span className="flex w-full flex-col gap-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-[10px] tracking-wide text-muted-foreground sm:text-xs">
                {new Date(date).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                <Clock size={12} className="sm:size-[14px]" />
                {readTime}
              </span>
            </span>
            <strong className="text-lg font-light tracking-tight text-foreground sm:text-xl">
              {title}
            </strong>
            <span className="text-sm font-light leading-relaxed text-muted-foreground line-clamp-2">
              {description}
            </span>
            <span className="flex flex-wrap gap-2 pt-0.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[12px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </span>
          </span>
        }
      >
        <div className="space-y-5 text-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={14} className="shrink-0 text-muted-foreground" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[12px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <hr className="border-dashed border-border/60" />

          <article
            className="
              prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-light prose-headings:tracking-tight
              prose-h1:text-2xl prose-h1:sm:text-3xl
              prose-h2:text-xl prose-h2:sm:text-2xl
              prose-h3:text-lg prose-h3:sm:text-xl
              prose-h4:text-base prose-h4:sm:text-lg
              prose-h5:text-sm prose-h6:text-sm
              prose-p:font-light prose-p:text-muted-foreground
              prose-strong:font-medium prose-strong:text-foreground
              prose-a:font-normal prose-a:text-foreground prose-a:no-underline hover:prose-a:underline
              prose-li:font-light prose-blockquote:font-light
            "
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <img
                    src={src ? asset(src) : src}
                    alt={alt}
                    loading="lazy"
                    className="w-full rounded-lg"
                  />
                ),
                a: ({ href, children }) => {
                  const next = outboundHref(href);
                  const external = next.startsWith("http");
                  return (
                    <a
                      href={next}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </Markdown>
          </article>
        </div>
      </ExpandableCard>
    </div>
  );
};

export default BlogCard;
