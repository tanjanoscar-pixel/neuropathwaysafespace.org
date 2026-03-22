import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-cyan-500 text-white hover:bg-cyan-600",
    outline: "border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50",
    ghost: "hover:bg-gray-100",
    gradient: "bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:from-cyan-600 hover:to-pink-600",
    navy: "bg-[#0a1628] text-white hover:bg-[#0f1f38]",
  };

  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-8 px-4 text-sm",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
