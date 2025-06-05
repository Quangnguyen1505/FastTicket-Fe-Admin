import { Toaster } from "react-hot-toast";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Toaster position="top-right" />
      {children}
    </div>
  );  
}
