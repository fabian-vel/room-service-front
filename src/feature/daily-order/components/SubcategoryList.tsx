import type {OrderDetails} from "@/feature/daily-order/types/Order.ts";
import {Separator} from "@/shared/shadcn/components/ui/separator.tsx";
import React from "react";

interface subcategoryCardProps {
    orderDetails: Record<number, OrderDetails[]>;
}

export function SubcategoryList({orderDetails}: Readonly<subcategoryCardProps>) {
    const COLORS = [
        "text-orange-700",
        "text-green-700",
        "text-blue-700",
        "text-purple-700",
        "text-red-700",
        "text-cyan-700",
        "text-pink-700",
        "text-amber-700",
        "text-indigo-700",
        "text-emerald-700",
    ];

    return (
        <div>
            {Object.values(orderDetails).map(grupo => {
                const color = COLORS[(grupo[0].mecaId - 1) % COLORS.length];
                return (
                    <div key={grupo[0].mecaId}
                         className="w-full border border-gray-100 bg-gray-50 mb-2 rounded-lg p-2">
                        <h3 className={`mb-1 text-sm font-semibold uppercase ${color}`}>
                            {grupo[0].mecaNombre}
                        </h3>
                        {grupo.map((item, index) => (
                            <React.Fragment key={item.meitId}>
                                <div className="flex items-center py-1">
                                    <span className="font-medium w-10">x{item.pedeCantidad}</span>
                                    <span className="truncate">{item.meitNombre}</span>
                                </div>
                                {index < grupo.length - 1 && (<Separator className="bg-gray-200 h-px"/>)}
                            </React.Fragment>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
