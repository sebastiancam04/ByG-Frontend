export interface User {
  id: number;
  nombres: string;
  apellidos?: string;
  email: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  id: number;
  correo: string;
  rol: string;
  usuario: string; // Nombre completo que envía el backend
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
  setUser: (user: User) => void; // ✅ AGREGADO: Para poder actualizar el perfil
}