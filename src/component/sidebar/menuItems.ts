import {CalendarDays, ChartColumnBig, ClipboardClock, ClipboardList, Utensils} from "lucide-react";
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
        href: "/reportes",
    },
];
