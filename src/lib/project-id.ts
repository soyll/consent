export function projectSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function projectSectionId(name: string) {
  return `project-${projectSlug(name)}`;
}
