import {Poppins} from "next/font/google"
import "./globals.css";


export const metadata = {
  title: "Ink Vote",
  description: "Vote for your favorite tattoos",
};

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can add any other weights needed
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
