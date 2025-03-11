"use client"
import Navigations from "@/components/layout/optionavigations";
import AuthProvider from "@/components/middleware/authContext";

export default function IndexLayout({ children }) {
  return (
    <>
      <Navigations/>
      <AuthProvider>
      <main>{children}</main>
      </AuthProvider>
    </>
  );
}