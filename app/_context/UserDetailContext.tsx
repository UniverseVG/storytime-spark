import { User } from "@/types";
import { createContext } from "react";
interface UserDetailContextType {
  userDetail: User | undefined;

  setUserDetail: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const UserDetailContext = createContext<
  UserDetailContextType | undefined
>(undefined);
