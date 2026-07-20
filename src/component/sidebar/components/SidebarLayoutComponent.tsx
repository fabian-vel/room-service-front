import {SidebarProvider, SidebarTrigger} from "@/shared/shadcn/components/ui/sidebar.tsx";
import {SidebarComponent} from "@/component/sidebar/components/SidebarComponent.tsx";

interface SidebarLayoutProps {
    children: React.ReactNode;
}

export function SidebarLayoutComponent({ children }: Readonly<SidebarLayoutProps>) {
    return (
        <SidebarProvider defaultOpen={true}>
            <SidebarComponent />
            <main className="flex-1">
                <SidebarTrigger className="m-4"/>
                {children}
            </main>
        </SidebarProvider>
    );
}
