import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/shared/shadcn/components/ui/sidebar.tsx";
import {ChefHat, LogOut, UserRound} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {MENU_ITEMS} from "@/component/sidebar/menuItems.ts";
import {useAuthStore} from "@/shared/store/authStore.ts";

export function SidebarComponent() {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const clearToken = useAuthStore((state) => state.clearToken);
    const nombre = useAuthStore((state) => state.nombre);
    const rol = useAuthStore((state) => state.rol);

    const handleLogout = () => {
        clearToken();
        navigate("/login", {replace: true});
    };

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
                            {MENU_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            render={<Link to={item.href}/>}
                                            isActive={pathname === item.href}
                                            className="h-14 px-4"
                                        >
                                            <Icon className="size-7 shrink-0"/>
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
                                <span className="text-sm font-medium">{nombre ?? "Usuario"}</span>
                                <span className="text-xs text-muted-foreground">{rol ?? "Empleado"}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut size={18}/>
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
