export const getStatusConfig = (status: string) => {
    switch (status) {
        case "A":
            return {
                label: "Activo",
                className: "border-green-600 text-green-700",
            };
        case "I":
            return {
                label: "Inactivo",
                className: "border-red-500 text-red-600",
            };
        default:
            return {
                label: "-",
                className: "border-gray-400 text-gray-500",
            };
    }
};
