import { Navigate, useParams } from "react-router-dom";

export function ProjectRedirect() {
  const { slug } = useParams();
  if (!slug) return <Navigate to="/#projects" replace />;
  return <Navigate to={`/#project-${slug}`} replace />;
}
