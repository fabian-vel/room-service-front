import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/shared/shadcn/components/ui/sidebar.tsx";
import {ChefHat, ClipboardList, History, LogOut, UserRound, UtensilsCrossed} from "lucide-react";

export function SidebarComponent() {
    const menuItems = [
        {
            title: "Pedidos",
            icon: ClipboardList,
            href: "/orders",
        },
        {
            title: "Historial",
            icon: History,
            href: "/history",
        },
        {
            title: "Menú",
            icon: UtensilsCrossed,
            href: "/menu",
        },
    ];


    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b px-4 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <ChefHat size={24} />
                    </div>

                    <div className="group-data-[collapsible=icon]:hidden">
                        <p className="text-lg font-semibold leading-none">
                            Room Service
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Cocina
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton>
                                            <Icon size={18}/>
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <UserRound size={18} />
                            <div className="flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">
                        Juan Pérez
                    </span>
                                <span className="text-xs text-muted-foreground">
                        Chef
                    </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut size={18} />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
