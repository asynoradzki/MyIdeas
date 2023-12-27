import { UserFromToken } from "./UserFormToken";

export type UserContextType = {
    currentUser: UserFromToken | null;
    userModifier: (user: UserFromToken | null) => void;
};
