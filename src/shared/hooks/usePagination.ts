import {useState} from "react";

export function usePagination<T>(data: T[], pageSize = 10) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const from = (safePage - 1) * pageSize;
    const paginatedData = data.slice(from, from + pageSize);

    return {
        paginatedData,
        currentPage: safePage,
        totalPages,
        totalItems: data.length,
        goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    };
}
