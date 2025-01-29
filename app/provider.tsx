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

const NextProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetail, setUserDetail] = useState<any>();
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
      const result: any = db
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
      console.log(result[0]);

      setUserDetail(result);
    } else {
      console.log(userInfo?.[0]);
      setUserDetail(userInfo?.[0]);
    }
  };

  return (
    <HeroUIProvider>
      <Header />
      {children}
      <ToastContainer />
    </HeroUIProvider>
  );
};

export default NextProvider;
