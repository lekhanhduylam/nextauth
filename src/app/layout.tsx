import { ColorModeScript } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { fonts } from "./fonts";
import Navbar from "./nav";
import theme from "./theme";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fonts.rubik.variable}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
