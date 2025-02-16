"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "./_context/UserDetailContext";
import { User } from "@/types";

const NextProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetail, setUserDetail] = useState<User | undefined>(undefined);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      saveNewUserIfNotExists();
    }
  }, [user]);

  const saveNewUserIfNotExists = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          image: user?.imageUrl,
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch user:", await response.json());
        return;
      }

      const data = await response.json();
      setUserDetail(data.user);
    } catch (error) {
      console.error("Error calling API:", error);
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
