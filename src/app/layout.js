import ReduxProvider from "@/providers/redux-provider";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata = {
  title: "TRS Property Mall",
  description: "Discover your dream property with TRS Property Mall Indore's premier real estate platform. Explore a wide range of residential and commercial properties, connect with trusted agents, and find the perfect space to call home or grow your business. Start your property journey with us today!",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
