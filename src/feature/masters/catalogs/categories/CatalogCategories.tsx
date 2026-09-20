import {useEffect, useState} from "react";
import type {Category, CategoryFormData} from "@/feature/masters/types/Category.ts";
import {getCategories, createCategory, updateCategory, deleteCategory} from "@/feature/masters/service/CategoryService.ts";
import {CategoriesTable} from "@/feature/masters/catalogs/categories/components/CategoriesTable.tsx";
import {CategoriesForm} from "@/feature/masters/catalogs/categories/components/CategoriesForm.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/shared/shadcn/components/ui/dialog.tsx";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/shared/shadcn/components/ui/alert-dialog.tsx";
import {Plus} from "lucide-react";
import {usePagination} from "@/shared/hooks/usePagination.ts";
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/shared/shadcn/components/ui/pagination.tsx";

export function CatalogCategories() {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    const fetchData = async () => {
        try {
            const result = await getCategories();
            setData(result);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getCategories(controller.signal)
            .then(result => {
                if (!controller.signal.aborted) setData(result);
            })
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') {
                    setError(e.message);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    const handleCreate = async (formData: CategoryFormData) => {
        await createCategory(formData);
        setFormOpen(false);
        await fetchData();
    };

    const handleUpdate = async (formData: CategoryFormData) => {
        if (!editingItem) return;
        await updateCategory(editingItem.mecaId, formData);
        setFormOpen(false);
        setEditingItem(null);
        await fetchData();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteCategory(deleteTarget.mecaId);
        setDeleteTarget(null);
        await fetchData();
    };

    const openCreate = () => {
        setEditingItem(null);
        setFormOpen(true);
    };

    const openEdit = (item: Category) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const {paginatedData, currentPage, totalPages, goToPage} = usePagination(data);

    if (loading)
        return <div className="flex h-full items-center justify-center">Loading...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="size-4"/>
                    Create category
                </Button>
            </div>

            <div className="min-h-0 flex-1">
                <CategoriesTable data={paginatedData} onEdit={openEdit} onDelete={setDeleteTarget}/>
            </div>

            {totalPages > 1 && (
                <Pagination>
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
            )}

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? "Edit" : "Create"} category
                        </DialogTitle>
                    </DialogHeader>
                    <CategoriesForm
                        initialData={editingItem}
                        onSubmit={editingItem ? handleUpdate : handleCreate}
                        onCancel={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This record will be disabled. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
