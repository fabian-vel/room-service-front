import {SidebarLayoutComponent} from "@/component/sidebar/components/SidebarLayoutComponent.tsx";

export function OrderScreen() {
  return (
      <SidebarLayoutComponent>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold text-orange-500">Hola Mundo - Order</h1>
        </div>
    </SidebarLayoutComponent>
  );
}
