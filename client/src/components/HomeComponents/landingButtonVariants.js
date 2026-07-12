import { cva } from "class-variance-authority";

export const landingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap text-sm leading-[1.5715] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "shadow text-white bg-blue-500 hover:bg-blue-600",
        secondary:
          "shadow text-gray-800 bg-white hover:text-black border border-gray-200 hover:border-gray-300",
        dark: "shadow text-gray-200 bg-gray-800 hover:bg-black",
        outline:
          "shadow-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-black",
      },
      size: {
        default: "px-4 py-2.5 rounded-lg",
        sm: "px-3 py-[5px] rounded-lg",
      },
      fullWidth: {
        true: "w-full sm:w-auto",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  },
);
