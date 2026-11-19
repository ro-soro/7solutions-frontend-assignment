// type ของข้อมูลจาก https://dummyjson.com/users (เฉพาะ field ที่ขอผ่าน select)
// Only the fields requested through select.

export type UserGender = "male" | "female";

export interface UserHairResponse {
  color: string;
  type: string;
}

export interface UserAddressResponse {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

export interface UserCompanyResponse {
  department: string;
  name: string;
  title: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: UserGender;
  hair: UserHairResponse;
  address: UserAddressResponse;
  company: UserCompanyResponse;
}

export interface UserListResponse {
  users: UserResponse[];
  total: number;
  skip: number;
  limit: number;
}
