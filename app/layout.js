import { Poppins } from "next/font/google"
import "./globals.css"

export const metadata = {
  title: 'Inkvote - Vote for the Best Tattoo Artists',
  description: 'Vote and support your favorite tattoo artists on Inkvote.',
  openGraph: {
    title: 'Inkvote - Vote for the Best Tattoo Artists',
    description: 'Vote and support your favorite tattoo artists on Inkvote.',
    url: 'https://inkvotes.vercel.app',
    siteName: 'Inkvote',
    type: 'website',
    images: [
      {
        url: '/linkImage.webp',
        width: 1200,
        height: 630,
        alt: 'Inkvote - Vote for Tattoo Artists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inkvote - Vote for the Best Tattoo Artists',
    description: 'Vote and support your favorite tattoo artists on Inkvote.',
    images: ['/linkImage.webp'],
  },
}

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">  
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}

