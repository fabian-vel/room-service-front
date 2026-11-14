import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/shared/shadcn/components/ui/pagination.tsx";

interface Props {
    currentPage: number,
    totalPages: number,
    goToPage: (page: number) => void,
}

// páginas a mostrar: primera, última, la actual y sus vecinas; null marca un salto ("...")
const paginasVisibles = (actual: number, total: number): (number | null)[] => {
    const fijas = [...new Set([1, actual - 1, actual, actual + 1, total])]
        .filter(p => p >= 1 && p <= total)
        .sort((a, b) => a - b);
    const paginas: (number | null)[] = [];
    for (const p of fijas) {
        const anterior = paginas.at(-1);
        // si el salto es de una sola página, se muestra esa página en vez de "..."
        if (anterior && p - anterior === 2) paginas.push(anterior + 1);
        else if (anterior && p - anterior > 2) paginas.push(null);
        paginas.push(p);
    }
    return paginas;
};

export function CatalogPaginator({currentPage, totalPages, goToPage}: Readonly<Props>) {
    return (
        <Pagination className="mb-2">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => goToPage(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
                {paginasVisibles(currentPage, totalPages).map((page, i) => page === null ? (
                    <PaginationItem key={`salto-${i}`}>
                        <PaginationEllipsis/>
                    </PaginationItem>
                ) : (
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => goToPage(page)}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => goToPage(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
