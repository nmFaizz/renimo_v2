import { cn } from "@/lib/utils"
import Navbar from "@/components/layouts/Navbar"

type MainLayoutProps = {
    withMargin?: boolean
    withNavbar?: boolean
} & React.ComponentProps<"main">

export default function MainLayout({
    withMargin = true,
    withNavbar = true,
    className,
    children,
    ...rest
}: MainLayoutProps){
    return (
        <>
            {withNavbar && <Navbar />}
            <main 
                className={cn(
                    withMargin && "centered-container-xl my-4 md:my-5",
                    className,
                )}
                {...rest}
            >
                
                {children}
            </main>
        </>
    )
}