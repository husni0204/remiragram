export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  image?: string;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  setTokenData: (user: User, token: string) => Promise<void>;
  loadToken: () => Promise<void>;
  removeToken: () => Promise<void>;
}
