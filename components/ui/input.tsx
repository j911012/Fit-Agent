import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-border bg-card-solid px-4 py-3 text-sm text-text placeholder:text-muted",
            "outline-none transition-colors focus:border-border-strong",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/60 focus:border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
