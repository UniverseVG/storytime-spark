"use client";
import React, { useReducer } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import Image from "next/image";
import { Button } from "@heroui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Link } from "@heroui/react";

const Header = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const MenuList = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "Create Story", path: "/create" },
    { id: 3, name: "Explore Stories", path: "/explore" },
    { id: 4, name: "Pricing", path: "/pricing" },
    { id: 5, name: "Contact Us", path: "/contact-us" },
  ];
  const [isMenuOpen, setIsMenuOpen] = useReducer((current) => !current, false);
  return (
    <Navbar maxWidth="full" onMenuOpenChange={setIsMenuOpen} position="sticky">
      <NavbarContent>
        <NavbarMenuToggle
          className="block lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen()}
        />
        <NavbarBrand>
          <Image
            src="/storytime-spark.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <h2 className="hidden sm:block font-bold text-2xl text-primary ml-2">
            StoryTime Spark
          </h2>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden xl:flex">
        {MenuList.map((item) => (
          <NavbarItem
            key={item.id}
            className="text-xl text-primary font-medium hover:underline mx-2"
          >
            <Link href={item.path}>{item.name}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarContent className="hidden lg:flex xl:hidden">
          {MenuList.map((item) => (
            <NavbarItem
              key={item.id}
              className="text-xl text-primary font-medium hover:underline mx-2"
            >
              <Link href={item.path}>{item.name}</Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <Button
          color="primary"
          onPress={() => {
            router.push("/dashboard");
          }}
        >
          {isSignedIn ? "Dashboard" : "Get Started"}
        </Button>

        <UserButton />
      </NavbarContent>
      <NavbarMenu>
        {MenuList.map((item) => (
          <NavbarMenuItem key={item.id}>
            <Link href={item.path}>{item.name}</Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
