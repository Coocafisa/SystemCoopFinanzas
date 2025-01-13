"use client"
import Navigations from "@/components/layout/optionavigations";
import InactivityHandler from "@/components/InactivityHandler";
import { AuthProvider } from "@/api/auth/authContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function IndexLayout({ children }) {
  const pathname = usePathname();
  const SpecificPage = ["/home/administrator/register"]
  const hideNavigation = SpecificPage.includes(pathname)
  return (
    <>
      {!hideNavigation && <Navigations/> }
      <AuthProvider>
      <main>{children}</main>
      </AuthProvider>
      <InactivityHandler/>
    </>
  );
}

  