import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {LoginScreen} from "./feature/auth/screen/LoginScreen";
import {OrderScreen} from "./feature/order/screen/OrderScreen";
import {useAuthStore} from "@/shared/store/authStore.ts";

function ProtectedRoute({children}: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace/>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginScreen/>}/>
                <Route path="/order" element={
                    <ProtectedRoute>
                        <OrderScreen/>
                    </ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
