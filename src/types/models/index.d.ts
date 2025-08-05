export interface User {
  name: string;
  lastname: string;
  email: string;
  username: string;
  gender: string;
  id: number;
  is_active: boolean;
}

export interface Auth {
  token: string;
  user: User;
}
