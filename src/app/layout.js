import "./globals.css";

export const metadata = {
  title: "IgraZone — Classic Browser Games",
  description: "Play timeless browser games with a clean, fast, distraction-free experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
