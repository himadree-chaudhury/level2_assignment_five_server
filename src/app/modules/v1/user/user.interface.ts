export enum UserRole {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

interface IAuth {
  provider: string;
  providerId: string;
}
export interface IUser {
    _id?: string;
  name: string;
  email: string;
  password: string;
  picture?: string;
  phone?: string;
  role?: UserRole;
  isBlocked?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  auths?: IAuth[];
}
