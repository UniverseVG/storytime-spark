/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "./_context/UserDetailContext";
import { User } from "@/types";

const NextProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetail, setUserDetail] = useState<User | undefined>(undefined);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    saveNewUserIfNotExists();
  }, [isLoaded, user]);

  const saveNewUserIfNotExists = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const userInfo = await db
        .select()
        .from(Users)
        .where(eq(Users.userEmail, email));

      if (!userInfo?.[0]) {
        const result: any = await db
          .insert(Users)
          .values({
            userName: user?.fullName,
            userEmail: email,
            userImage: user?.imageUrl,
          })
          .returning({
            userEmail: Users.userEmail,
            userName: Users.userName,
            userImage: Users.userImage,
            credit: Users.credit,
          });
        setUserDetail(result?.[0]);
      } else {
        setUserDetail(userInfo?.[0] as User);
      }
    } catch (error) {
      console.error("Error saving new user", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <HeroUIProvider>
        <Header />
        {children}
        <ToastContainer />
      </HeroUIProvider>
    </UserDetailContext.Provider>
  );
};

export default NextProvider;
