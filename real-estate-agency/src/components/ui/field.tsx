import * as React from "react"
import { cn } from "@/lib/utils"

const FieldGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("space-y-4", className)} {...props} />
)

const Field = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("space-y-2 flex flex-col", className)} {...props} />
)

const FieldLabel = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className
        )}
        {...props}
    />
)

const FieldError = ({ errors }: { errors: any[] }) => {
    if (!errors.length) return null
    return (
        <p className="text-sm font-medium text-destructive">
            {errors.map((error) => error?.message || error).join(", ")}
        </p>
    )
}

export { Field, FieldError, FieldGroup, FieldLabel }