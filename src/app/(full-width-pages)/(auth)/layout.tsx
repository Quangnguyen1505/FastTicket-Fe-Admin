import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          <Toaster position="top-right" />
          {children}
          
          {/* Khung hình nền bên phải */}
          <div className="lg:w-1/2 w-full h-full relative hidden lg:block">
            {/* Hình nền full */}
            <Image
              src="/images/logo-login.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />

            {/* Overlay nếu muốn mờ bớt hình */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Nội dung phía trên hình */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo-login.jpg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-white">
                  Chào mừng đã đến với trang quản lý hệ thống
                </p>
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
