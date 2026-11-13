import { projectSectionId } from "./project-id";

export { projectSectionId };

export function blogSectionId(slug: string) {
  return `blog-${slug}`;
}

export function openSourceSectionId(slug: string) {
  return `opensource-${slug}`;
}
