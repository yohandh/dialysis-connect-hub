import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Added new variants for our color scheme
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        purple: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        // Education material types
        diet: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        lifestyle: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        general: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
        monitoring: "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-200",
        // CKD Stages
        stage1: "border-transparent bg-green-500 text-white hover:bg-green-600",
        stage2: "border-transparent bg-lime-500 text-white hover:bg-lime-600",
        stage3: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        stage4: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        stage5: "border-transparent bg-red-500 text-white hover:bg-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
