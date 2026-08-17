import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบจัดการวัสดุเทศบาล | Equipment Management System",
  description: "ระบบจัดการวัสดุและครุภัณฑ์สำหรับเทศบาล บริหารจัดการคลังวัสดุ การเบิก-จ่าย และรายงานสรุป",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body style={{ fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
