import { type buttonVariants, Button } from "@/components/ui/buttons/Button"
import { type VariantProps } from "class-variance-authority"
import Link from "next/link";

type ButtonLinkProps = {
    className?: string;
    href: string;
    children: React.ReactNode;  
} & React.ComponentProps<"a"> &
    VariantProps<typeof buttonVariants> 

export default function ButtonLink({
    className,
    variant,
    size,
    href,
    children,
    ...rest
}: ButtonLinkProps) {
    return (
        <Button 
            asChild 
            variant={variant} 
            className={className}
            size={size}
        >
            <Link href={href} {...rest}>
                {children}
            </Link>
        </Button>
    )
}