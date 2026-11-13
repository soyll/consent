import { Moon, Sun, TvMinimal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "next-themes";

const themes = [
  { theme: "system", icon: TvMinimal },
  { theme: "light", icon: Sun },
  { theme: "dark", icon: Moon },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";

  return (
    <Tabs
      value={currentTheme}
      onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
    >
      <TabsList className="flex w-full rounded-full border border-dashed border-border/70 bg-muted/30 gap-1 p-1">
        {themes.map(({ theme: value, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-7 flex-1 rounded-full flex items-center justify-center bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
          >
            <Icon className="size-[15px]" />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
