"use client";

import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "./context/ReactQueryClientProvider";
import { ThemeProvider } from "styled-components";
import theme from "./theme/theme";
import GlobalStyles from "./theme/GlobalStyles";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ReactQueryClientProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
}
