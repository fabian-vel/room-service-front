import {useSearchParams} from "react-router-dom";
import {MasterSelector} from "@/feature/masters/components/MasterSelector.tsx";
import {CatalogCategories} from "@/feature/masters/catalogs/categories/CatalogCategories.tsx";
import {CatalogLabels} from "@/feature/masters/catalogs/labels/CatalogLabels.tsx";
import {CatalogConstants} from "@/feature/masters/catalogs/constants/CatalogConstants.tsx";
import React from "react";

const VALID_MASTERS: Record<string, React.FC> = {
    categories: CatalogCategories,
    labels: CatalogLabels,
    constants: CatalogConstants,
};

export function MastersScreen() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selected = searchParams.get("maestro") ?? "categories";

    const handleChange = (value: string) => {
        setSearchParams({maestro: value});
    };

    const ActiveCatalog = VALID_MASTERS[selected];

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Maestros:</span>
                <MasterSelector value={selected} onChange={handleChange}/>
            </div>

            <div className="min-h-0 flex-1">
                {ActiveCatalog ? <ActiveCatalog/> : (
                    <p className="text-center text-muted-foreground">Master not found</p>
                )}
            </div>
        </div>

    );
}
