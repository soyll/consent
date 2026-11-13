import { useEffect, useState } from "react";
import { blogs } from "@/data/blog";
import BlogCard from "./BlogCard";
import { blogSectionId } from "@/lib/section-id";
import { scrollToSectionId } from "@/lib/scroll-to";

const BlogSection = () => {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const match = blogs.find((b) => blogSectionId(b.slug) === hash);
      if (match) {
        setOpenSlug(match.slug);
        requestAnimationFrame(() =>
          scrollToSectionId(blogSectionId(match.slug), { behavior: "smooth" }),
        );
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <section id="blogs" className="w-full space-y-6">
      <h2 className="text-2xl font-light tracking-tight sm:text-3xl">Блоги</h2>
      <div className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.slug}
            {...blog}
            expanded={openSlug === blog.slug}
            onExpandedChange={(next) => {
              setOpenSlug(next ? blog.slug : null);
              if (next) {
                history.replaceState(null, "", `#${blogSectionId(blog.slug)}`);
              } else if (window.location.hash === `#${blogSectionId(blog.slug)}`) {
                history.replaceState(null, "", "#blogs");
              }
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
