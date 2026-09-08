import { User } from './User.model';

export interface LoginResponse {

  token: string;
  userName: string;
  role: string;

}