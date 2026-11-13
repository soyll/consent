import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

type SocialIconProps = {
  icon: string;
  darkIcon?: string;
  alt: string;
  className?: string;
};

const SocialIcon = ({ icon, darkIcon, alt, className }: SocialIconProps) => {
  return (
    <span className="relative inline-flex shrink-0">
      <img
        src={asset(icon)}
        alt={alt}
        className={cn("block", className, darkIcon ? "dark:hidden" : "")}
      />
      {darkIcon ? (
        <img
          src={asset(darkIcon)}
          alt={alt}
          className={cn("hidden", className, "dark:block")}
        />
      ) : null}
    </span>
  );
};

export default SocialIcon;
