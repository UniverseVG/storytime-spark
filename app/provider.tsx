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
  const [userDetail, setUserDetail] = useState<User>();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    saveNewUserIfNotExists();
  }, [user]);
  const saveNewUserIfNotExists = async () => {
    const userInfo = await db
      .select()
      .from(Users)
      .where(
        eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress as string)
      );

    if (!userInfo?.[0]) {
      const result: any = await db
        .insert(Users)
        .values({
          userName: user?.fullName,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userImage: user?.imageUrl,
        })
        .returning({
          userEmail: Users?.userEmail,
          userName: Users?.userName,
          userImage: Users?.userImage,
          credits: Users?.credit,
        });
      setUserDetail(result);
    } else {
      setUserDetail(userInfo?.[0] as User);
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
