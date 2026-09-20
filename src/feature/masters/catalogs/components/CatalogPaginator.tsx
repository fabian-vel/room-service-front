import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/shared/shadcn/components/ui/pagination.tsx";

interface Props {
    currentPage: number,
    totalPages: number,
    goToPage: (page: number) => void,
}

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
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
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
