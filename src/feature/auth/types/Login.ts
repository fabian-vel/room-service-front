export interface LoginRequest {
    usuario: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    nombre: string;
    rol: string;
}
