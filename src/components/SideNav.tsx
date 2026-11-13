import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";
import {
  TocProgress,
  type TocProgressItem,
} from "@/components/arc/toc-progress";

type SideNavProps = {
  items: TocProgressItem[];
};

export default function SideNav({ items }: SideNavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside className="pointer-events-none fixed top-8 right-4 z-[60] hidden w-[220px] lg:block xl:right-8">
      <div className="pointer-events-auto max-h-[calc(100dvh-4rem)] space-y-4 overflow-y-auto">
        <ThemeToggle />
        <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm backdrop-blur">
            <TocProgress
              items={items}
              offset={88}
              showTimeLeft={false}
              title="На этой странице"
              onNavigate={(id) => {
                history.replaceState(null, "", `#${id}`);
              }}
            />
        </div>
      </div>
    </aside>,
    document.body,
  );
}
