import type { UserResponse } from "@/services/user";

interface UserFixtureInput {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: UserResponse["gender"];
  hairColor: string;
  postalCode: string;
  department: string;
}

export const buildUser = (input: UserFixtureInput): UserResponse => ({
  id: input.id,
  firstName: input.firstName,
  lastName: input.lastName,
  age: input.age,
  gender: input.gender,
  hair: { color: input.hairColor, type: "Straight" },
  address: {
    address: "1 Main Street",
    city: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    postalCode: input.postalCode,
    country: "United States",
  },
  company: {
    department: input.department,
    name: "Acme",
    title: "Engineer",
  },
});

export const USERS: UserResponse[] = [
  buildUser({
    id: 1,
    firstName: "Terry",
    lastName: "Medhurst",
    age: 50,
    gender: "male",
    hairColor: "Black",
    postalCode: "20020",
    department: "Marketing",
  }),
  buildUser({
    id: 2,
    firstName: "Sheldon",
    lastName: "Quigley",
    age: 28,
    gender: "male",
    hairColor: "Blond",
    postalCode: "60008",
    department: "Services",
  }),
  buildUser({
    id: 3,
    firstName: "Terrill",
    lastName: "Hills",
    age: 38,
    gender: "female",
    hairColor: "Black",
    postalCode: "80041",
    department: "Marketing",
  }),
  buildUser({
    id: 4,
    firstName: "Miles",
    lastName: "Cummerata",
    age: 49,
    gender: "female",
    hairColor: "Chestnut",
    postalCode: "37042",
    department: "Marketing",
  }),
];
