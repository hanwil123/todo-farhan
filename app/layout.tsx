import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/auth-context';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TodoMaster - Task Management App',
  description: 'A simple and elegant todo list application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light"> */}
          <AuthProvider>{children}</AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

