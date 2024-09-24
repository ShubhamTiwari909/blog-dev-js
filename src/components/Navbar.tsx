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
import { useMarkdownStore, User } from "@/store/useStore";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { ArrowDown } from "lucide-react";

const otherLinks = [
  {
    key: 1,
    label: "Globe",
    href: "/globe",
  },
];

// Mobile menu links
const menuItems = (user: User, signOut: () => void) => {
  return [
    {
      text: "Profile",
      href: "/profile",
      render: user?.uid,
    },
    {
      text: "Tags",
      href: "/blogs/tags",
      render: user?.uid,
    },
    {
      text: (
        <Dropdown>
          <DropdownTrigger>
            <Button
              color="primary"
              variant="bordered"
              className="text-blue-200"
            >
              Others <ArrowDown size="1rem" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {otherLinks.map((item) => (
              <DropdownItem key={item.key}>
                <Link href={item.href}>{item.label}</Link>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      ),
      href: "#",
      type: "dropdown",
      render: user?.uid,
    },
    {
      text: "Sign Out",
      render: user?.uid,
      onClick: signOut,
    },
  ];
};

export default function NavbarComponent({ className }: { className: string }) {
  // Local state
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Global state and its setter method
  const updateUser = useMarkdownStore((state) => state.updateUser);
  const user = useMarkdownStore((state) => state.user);
  const updateBlogId = useMarkdownStore((state) => state.updateBlogId);

  // Router for handling route dynamically
  const router = useRouter();

  const googleSignIn = () =>
    signInWithGooglePopup().then((res) => {
      updateUser({
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
      });
    });

  const signOut = () => {
    logOut().then(() => {
      updateUser({
        uid: "",
        displayName: "",
        email: "",
        photoURL: "",
      });
      router.push("/");
    });
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className={className}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            BlogDev.js
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="flex items-center gap-4">
          <NavbarItem className="hidden md:block">
            <Button
              as={Link}
              color="primary"
              href="/blogs/tags"
              variant="flat"
              onClick={() => {
                updateBlogId("");
                setIsMenuOpen(false);
              }}
            >
              Tags
            </Button>
          </NavbarItem>
          {user?.uid && (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  href="/create-blog"
                  variant="flat"
                  onClick={() => updateBlogId("")}
                >
                  Create
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  href="/profile"
                  variant="flat"
                  onClick={() => {
                    updateBlogId("");
                    setIsMenuOpen(false);
                  }}
                >
                  Profile
                </Button>
              </NavbarItem>
            </>
          )}
          <Dropdown>
            <DropdownTrigger className="hidden md:flex">
              <Button color="primary" variant="flat">
                Others <ArrowDown size="1rem" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {otherLinks.map((item) => (
                <DropdownItem key={item.key}>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {!user?.uid && (
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={googleSignIn}
              >
                Sign Up
              </Button>
            </NavbarItem>
          )}
          {user.uid && (
            <NavbarItem className="hidden md:block">
              <Button
                as={Link}
                color="danger"
                href="#"
                variant="flat"
                onClick={signOut}
              >
                Logout
              </Button>
            </NavbarItem>
          )}
        </div>
      </NavbarContent>
      <NavbarMenu className="bg-slate-900/60 text-slate-100 pt-10 space-y-5">
        {menuItems(user, signOut).map((item, index) => (
          <NavbarMenuItem key={`${item.text}-${index}`}>
            {item?.render &&
              (item.type === "dropdown" ? (
                item.text
              ) : (
                <>
                  {item.href ? (
                    <Link
                      className={`w-full`}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <Button color="danger" onClick={item.onClick}>
                      Log out
                    </Button>
                  )}
                </>
              ))}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
