"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { HeroUIProvider } from "@heroui/react";
import React from "react";
import Header from "./_components/Header";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const NextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <HeroUIProvider>
        <Header />
        {children}
        <ToastContainer />
      </HeroUIProvider>
    </ClerkProvider>
  );
};

export default NextProvider;
