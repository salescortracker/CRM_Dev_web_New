import { User } from './User.model';

// Menu/screen assigned to the user's role in Roles & Permissions.
export interface AuthMenu {

  menuId: number;
  menuName: string;
  parentMenuId: number | null;
  url: string | null;
  icon: string | null;
  orderNo: number | null;

}

export interface LoginResponse {

  token: string;
  userName: string;
  role: string;

  // Display name of the user (UserLogin.FullName).
  fullName?: string | null;

  // Layout + dashboard for the user, decided by the server from the
  // assigned role: 'Super Admin' | 'Admin' | 'User'.
  layout?: string | null;

  // null/undefined = no role-based menus; the default sidebar is used.
  menus?: AuthMenu[] | null;

}
