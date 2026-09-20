import {useEffect, useState} from "react";
import type {Constant, ConstantFormData} from "@/feature/masters/types/Constant.ts";
import {getConstants, createConstant, updateConstant, deleteConstant} from "@/feature/masters/service/ConstantService.ts";
import {ConstantsTable} from "@/feature/masters/catalogs/constants/components/ConstantsTable.tsx";
import {ConstantsForm} from "@/feature/masters/catalogs/constants/components/ConstantsForm.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/shared/shadcn/components/ui/dialog.tsx";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/shared/shadcn/components/ui/alert-dialog.tsx";
import {Plus} from "lucide-react";
import {usePagination} from "@/shared/hooks/usePagination.ts";
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/shared/shadcn/components/ui/pagination.tsx";

export function CatalogConstants() {
    const [data, setData] = useState<Constant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Constant | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Constant | null>(null);

    const fetchData = async () => {
        try {
            const result = await getConstants();
            setData(result);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getConstants(controller.signal)
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

    const handleCreate = async (formData: ConstantFormData) => {
        await createConstant(formData);
        setFormOpen(false);
        await fetchData();
    };

    const handleUpdate = async (formData: ConstantFormData) => {
        if (!editingItem) return;
        await updateConstant(editingItem.consId, formData);
        setFormOpen(false);
        setEditingItem(null);
        await fetchData();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteConstant(deleteTarget.consId);
        setDeleteTarget(null);
        await fetchData();
    };

    const openCreate = () => {
        setEditingItem(null);
        setFormOpen(true);
    };

    const openEdit = (item: Constant) => {
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
                    Create constant
                </Button>
            </div>

            <div className="min-h-0 flex-1">
                <ConstantsTable data={paginatedData} onEdit={openEdit} onDelete={setDeleteTarget}/>
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
                            {editingItem ? "Update" : "Create"} constant
                        </DialogTitle>
                    </DialogHeader>
                    <ConstantsForm
                        initialData={editingItem}
                        onSubmit={editingItem ? handleUpdate : handleCreate}
                        onCancel={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete constant?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The record will be disabled. This action cannot be undone.
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
