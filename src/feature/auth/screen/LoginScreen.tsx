import { useNavigate } from "react-router-dom";
import {LoginFormComponent} from "../components/LoginFormComponent.tsx";

export function LoginScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-wide">
          Grand Hotel
        </h1>
        <h2 className="text-emerald-700 font-medium tracking-widest text-xs uppercase mt-1">
          Room Service
        </h2>
        <LoginFormComponent
          onSubmit={() => navigate("/order")}
        />
      </div>
    </div>
  );
}
