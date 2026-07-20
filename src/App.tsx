import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from "./feature/auth/screen/LoginScreen";
import { OrderScreen } from "./feature/order/screen/OrderScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/order" element={<OrderScreen />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
