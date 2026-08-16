import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {LoginScreen} from "./feature/auth/screen/LoginScreen";
import {DailyOrderScreen} from "./feature/daily-order/screen/DailyOrderScreen";
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
                    <Route path="/order" element={<DailyOrderScreen/>}/>
                    {/* agrega aquí las futuras vistas */}
                </Route>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
