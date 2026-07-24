import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/shared/shadcn/components/ui/card.tsx";
import {Bell, CircleHelp, CookingPot, CircleCheck, ArrowRight} from "lucide-react";

interface OrderCardProps {
    state: "pendiente" | "preparacion" | "entregado";
    order?: object;
}

export function OrderCardComponente({state, order}: Readonly<OrderCardProps>) {

    console.log(order);

    const getBorderColorClass = (state: string): string => {
        switch (state) {
            case "pendiente":
                return "border-yellow-600";
            case "preparacion":
                return "border-green-700";
            case "entregado":
                return "border-blue-900";
            default:
                return "border-gray-300";
        }
    };

    const getStateIcon = (state: string): React.ReactElement => {
        switch (state) {
            case "pendiente":
                return <Bell className="text-yellow-600 fill-yellow-600"/>;
            case "preparacion":
                return <CookingPot className="text-green-700 fill-green-700"/>;
            case "entregado":
                return <CircleCheck className="text-white fill-blue-900"/>;
            default:
                return <CircleHelp className="text-gray-400"/>;
        }
    };

    const stateIcon = getStateIcon(state);
    const borderColorClass = getBorderColorClass(state);

    return (
        <Card className={`${borderColorClass} border-l-4`}>
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row">
                                    <span
                                        className="mr-2 inline-flex h-6 min-w-6 items-center
                                        justify-center rounded-full px-2 text-lg font-semibold bg-gray-200">
                                    302
                                </span>
                        {stateIcon}
                    </div>
                </CardTitle>
                <CardAction>
                                <span className="font-medium text-gray-700">
                                    03:35 p.m.
                                </span>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between mt-4">
                        <h1 className="font-medium text-[15px]">Lomo a la parrilla</h1>
                        <ArrowRight/>
                    </div>
                    <div className="flex flex-row justify-between mt-4">
                        <h2 className="items-start font-medium text-gray-700">2 productos</h2>
                        <h3 className="items-end font-medium">$45.000</h3>
                    </div>

                </div>

            </CardContent>
        </Card>
    );
}
