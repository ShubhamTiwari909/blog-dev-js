"use client";
import React from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { logOut, signInWithGooglePopup } from "../../server/auth";
import { useMarkdownStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function NavbarComponent({ className }: { className: string }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const updateUser = useMarkdownStore((state) => state.updateUser);
  const user = useMarkdownStore((state) => state.user);
  const router = useRouter();

  const menuItems = ["Profile", "Log Out"];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className={className}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>BlogDev.js</NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        {!user?.uid ? (
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="#"
              variant="flat"
              onClick={() =>
                signInWithGooglePopup().then((res) => {
                  updateUser({
                    uid: res.user.uid,
                    displayName: res.user.displayName,
                    email: res.user.email,
                    photoURL: res.user.photoURL,
                  });
                })
              }
            >
              Sign Up
            </Button>
          </NavbarItem>
        ) : (
          <div className="flex items-center gap-4">
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/create-blog"
                variant="flat"
              >
                Create
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden md:block">
              <Button
                as={Link}
                color="danger"
                href="#"
                variant="flat"
                onClick={() => {
                  logOut().then(() => {
                    updateUser({
                      uid: "",
                      displayName: "",
                      email: "",
                      photoURL: "",
                    }),
                      router.push("/");
                  });
                }}
              >
                Logout
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>
      <NavbarMenu className="bg-slate-900/60 text-slate-100 pt-10 space-y-5">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full ${item === "Log Out" ? "text-red-500" : ""}`}
              href="#"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
