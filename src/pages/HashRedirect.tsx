import { Navigate, useParams } from "react-router-dom";

type HashRedirectProps = {
  prefix: string;
  fallback: string;
};

/** Maps `/section/:slug` → `/#prefix-slug` so deep links stay on the single page. */
export function HashRedirect({ prefix, fallback }: HashRedirectProps) {
  const { slug } = useParams();
  if (!slug) return <Navigate to={fallback} replace />;
  return <Navigate to={`/#${prefix}-${slug}`} replace />;
}
