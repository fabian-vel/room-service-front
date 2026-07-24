import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/shared/shadcn/components/ui/sidebar.tsx";
import {SidebarComponent} from "@/component/sidebar/components/SidebarComponent.tsx";

interface SidebarLayoutProps {
    children: React.ReactNode;
}

export function SidebarLayoutComponent({children}: Readonly<SidebarLayoutProps>) {
    const date = new Date();

    const hour = new Intl.DateTimeFormat("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);

    const fullDate = new Intl.DateTimeFormat("es-CO", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);

    return (
        <SidebarProvider defaultOpen>
            <SidebarComponent/>
            <SidebarInset>
                <header className="flex h-16 items-center justify-between bg-slate-100 px-6">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger/>
                        <h1 className="text-xl font-semibold">
                            Pedidos
                        </h1>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold">{hour}</span>
                        <span className="text-sm text-muted-foreground">{fullDate}</span>
                    </div>
                </header>
                <main className="flex-1 p-6 bg-slate-100">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
