import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {LoginFormComponent} from "../components/LoginFormComponent.tsx";
import {loginEmpleado} from "../service/authService.ts";
import {useAuthStore} from "@/shared/store/authStore.ts";

export function LoginScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveToken = useAuthStore((state) => state.saveToken);

  const handleSubmit = async (usuario: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginEmpleado({usuario, password});
      saveToken(response.token, response.nombre, response.rol);
      navigate('/order');
    } catch (err: any) {
      setError(err?.message ?? 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-wide">
            Grand Hotel
          </h1>
          <h2 className="text-emerald-700 font-medium tracking-widest text-xs uppercase">
            Room Service — Cocina
          </h2>
          {error && (
              <p className="text-red-600 text-sm">{error}</p>
          )}
          <LoginFormComponent
              onSubmit={handleSubmit}
              isLoading={isLoading}
          />
        </div>
      </div>
  );
}
