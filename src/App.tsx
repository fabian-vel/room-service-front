import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {LoginScreen} from "./feature/auth/screen/LoginScreen";
import {OrderScreen} from "./feature/order/screen/OrderScreen";
import {DailyOrderScreen} from "./feature/daily-order/screen/DailyOrderScreen";
import {HistoryScreen} from "./feature/history/screen/HistoryScreen";
import {MenuScreen} from "./feature/menu/screen/MenuScreen";
import {ReportesScreen} from "./feature/reportes/screen/ReportesScreen";
import {MastersScreen} from "./feature/masters/screen/MastersScreen";
import {useAuthStore} from "@/shared/store/authStore.ts";
import {SidebarLayoutComponent} from "@/component/sidebar/SidebarLayoutComponent.tsx";

function ProtectedRoute({children}: {children: React.ReactNode}) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace/>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginScreen/>}/>
                <Route element={
                    <ProtectedRoute>
                        <SidebarLayoutComponent/>
                    </ProtectedRoute>
                }>
                    <Route path="/order" element={<OrderScreen/>}/>
                    <Route path="/pedidos-del-dia" element={<DailyOrderScreen/>}/>
                    <Route path="/history" element={<HistoryScreen/>}/>
                    <Route path="/menu" element={<MenuScreen/>}/>
                    <Route path="/reportes" element={<ReportesScreen/>}/>
                    <Route path="/masters" element={<MastersScreen/>}/>
                    {/* agrega aquí las futuras vistas */}
                </Route>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
