import {CalendarDays, ChartColumnBig, ClipboardList, Database, Receipt, Users, Utensils} from "lucide-react";
import type {LucideIcon} from "lucide-react";

export interface SidebarMenuItem {
    title: string;
    icon: LucideIcon;
    href: string;
}

export const MENU_ITEMS: SidebarMenuItem[] = [
    {
        title: "Pedidos",
        icon: ClipboardList,
        href: "/order",
    },
    {
        title: "Pedidos del día",
        icon: CalendarDays,
        href: "/pedidos-del-dia",
    },
    {
        title: "Menú",
        icon: Utensils,
        href: "/menu",
    },
    {
        title: "Reportes",
        icon: ChartColumnBig,
        href: "/reportes",
    },
    {
        title: "Factura",
        icon: Receipt,
        href: "/factura",
    },
    {
        title: "Maestros",
        icon: Database,
        href: "/masters",
    },
    {
        title: "Empleados",
        icon: Users,
        href: "/empleados",
    },
];
