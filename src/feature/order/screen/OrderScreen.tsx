import {SidebarLayoutComponent} from "@/component/sidebar/components/SidebarLayoutComponent.tsx";
import {cn} from "@/shared/shadcn/lib/utils.ts";
import {OrderCardComponente} from "@/feature/order/components/OrderCardComponente.tsx";

export function OrderScreen() {
    const cardClass = "flex-1 flex-col border rounded-lg h-full bg-white p-4";
    const titleClass = "text-lg font-semibold";
    const badgeClass = " ml-2 mb-6 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold border";

    return (
        <SidebarLayoutComponent>
            <div className="flex h-full items-center justify-center rounded-xl">
                <div className={cardClass}>
                    <div className="flex-row flex">
                        <h1 className={cn(titleClass, "text-yellow-600")}>PENDIENTES</h1>
                        <span className={cn(badgeClass, "border-yellow-600")}>1</span>
                    </div>
                    <OrderCardComponente state={'pendiente'}/>
                </div>
                <div className={cardClass}>
                    <div className="flex-row flex">
                        <h1 className={cn(titleClass, "text-green-700")}>EN PREPARACIÓN</h1>
                        <span className={cn(badgeClass, "border-green-700")}>10</span>
                    </div>
                    <OrderCardComponente state={'preparacion'}/>
                </div>
                <div className={cardClass}>
                    <div className="flex-row flex">
                        <h1 className={cn(titleClass, "text-blue-900")}>ENTREGADO</h1>
                        <span className={cn(badgeClass, "border-blue-900")}>100</span>
                    </div>
                    <OrderCardComponente state={'entregado'}/>
                </div>
            </div>
        </SidebarLayoutComponent>
    );
}
