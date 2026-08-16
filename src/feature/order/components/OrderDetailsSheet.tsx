import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/shared/shadcn/components/ui/sheet.tsx";
import type {Order, OrderDetails} from "@/feature/order/types/Order.ts";
import {Bed, ClipboardList, Clock, HandPlatter} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {SubcategoryList} from "@/feature/order/components/SubcategoryList.tsx";
import {Separator} from "@/shared/shadcn/components/ui/separator.tsx";
import {formatHour} from "@/shared/utils/date.ts";
import {calcularTotalProductos} from "@/shared/utils/order.ts";

interface Props {
    open: boolean;
    order: Order | null;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({open, order, onOpenChange}: Readonly<Props>) {

    console.log(order);

    const formatNumberOrder = (value: number): string => {
        return value.toString().padStart(4, "0");
    };

    const groupBySubCategory = (items: OrderDetails[]) => {
        return items.reduce<Record<number, OrderDetails[]>>((acc, item) => {
            if (!acc[item.mecaId]) {
                acc[item.mecaId] = [];
            }

            acc[item.mecaId].push(item);

            return acc;
        }, {});
    };

    const itemsAgrupados = groupBySubCategory(order?.detallePedidoList ?? []);

    const totalProductos = calcularTotalProductos(order?.detallePedidoList);

    const hora = formatHour(order?.pediFechaCreacion);

    const observacion = order?.pediObservacion?.trim()
        ? order.pediObservacion
        : 'Sin observaciones';

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent side="right" style={{minWidth: 800, width: 1000}} className="rounded-lg">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle className="flex flex-row items-center">
                        <ClipboardList className="text-yellow-900 mr-2"/>
                        <h1 className="text-2xl">Pedido #{formatNumberOrder(order?.pediId ?? 0)}</h1>
                        <h2 className="ml-2 bg-yellow-400 rounded-full py-0.5 px-3 text-yellow-900">{order?.espeNombre ?? 'Estado ?'}</h2>
                    </SheetTitle>
                    <SheetDescription className="flex flex-row items-center mt-2 justify-between">
                        <div className="flex flex-row items-center justify-start">
                            <Bed className="mr-2"/>
                            <h1 className="text-sm font-medium">Habitación {order?.pediHabitacion}</h1>
                        </div>
                        <div className="flex flex-row items-center justify-start">
                            <HandPlatter className="mr-2"/>
                            <h1 className="text-sm font-medium">{totalProductos} Producto(s)</h1>
                        </div>
                        <div className="flex flex-row items-center justify-start">
                            <Clock className="mr-2"/>
                            <h1 className="text-sm font-medium">{hora}</h1>
                        </div>
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4 flex flex-row items-start justify-between h-full">
                    <div className="flex flex-col basis-[55%] h-full">
                        <h1 className="font-bold text-sm mb-1">Items por categoría</h1>
                        <SubcategoryList
                            orderDetails={itemsAgrupados}
                        />
                    </div>
                    <Separator orientation="vertical" className="bg-gray-200 h-full w-px"/>
                    <div className="mb-2 basis-[40%] h-full">
                        <h1 className="font-bold text-sm mb-1">Observaciones</h1>
                        <p className="text-sm p-4 bg-[#fdf3dc] rounded-lg w-full h-80 overflow-y-auto
                        text-justify wrap-break-word">
                            {observacion}
                        </p>
                    </div>
                </div>
                <SheetFooter className="items-center justify-center border-t border-gray-200 p-2">
                    <Button
                        className="text-white bg-yellow-600 hover:bg-yellow-700 p-5"
                        style={{width: '70%'}}
                        onClick={() => {
                        }}
                    >
                        Iniciar preparación
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
