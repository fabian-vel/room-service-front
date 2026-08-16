import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/shared/shadcn/components/ui/sidebar.tsx";
import {ChartColumnBig, ChefHat, ClipboardList, ClipboardClock, LogOut, UserRound, Utensils} from "lucide-react";

export function SidebarComponent() {
    const menuItems = [
        {
            title: "Pedidos",
            icon: ClipboardList,
            href: "/orders",
        },
        {
            title: "Historial",
            icon: ClipboardClock,
            href: "/history",
        },
        {
            title: "Menú",
            icon: Utensils,
            href: "/menu",
        },
        {
            title: "Reportes",
            icon: ChartColumnBig,
            href: "/menu",
        },
    ];


    return (
        <Sidebar collapsible="icon" className="border-r-0 shadow-none">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <ChefHat size={24}/>
                            <span className="text-lg font-semibold leading-none">Room Service</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton className="h-14 px-4">
                                            <Icon className="size-7 shrink-0" />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <UserRound size={25}/>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <span className="text-sm font-medium">Juan Pérez</span>
                                <span className="text-xs text-muted-foreground">Chef</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut size={18}/>
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
