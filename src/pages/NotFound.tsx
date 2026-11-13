import { FadeIn } from "@/components/helpers/FadeIn";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  backPath?: string;
  backLabel?: string;
}

const NotFound = ({
  backPath = "/",
  backLabel = "На главную",
}: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col space-y-16 px-6 pt-6 pb-8 sm:pt-12 sm:pb-24">
      <FadeIn yOffset={10} duration={0.4}>
        <button
          onClick={() => navigate(backPath)}
          className="flex w-fit cursor-pointer items-center gap-3 text-md font-light tracking-tight text-muted-foreground duration-200 hover:text-foreground"
        >
          <ChevronLeft size={20} strokeWidth={2.25} /> {backLabel}
        </button>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex items-center text-lg font-light tracking-tight sm:text-2xl">
            <span className="border-r-2 border-border/80 pr-5 font-normal text-foreground">
              404
            </span>
            <span className="pl-5 text-muted-foreground">
              Страница не найдена
            </span>
          </div>
        </div>
      </FadeIn>
    </main>
  );
};

export default NotFound;
