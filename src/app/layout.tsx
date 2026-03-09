import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AuthProvider from '@/components/auth/AuthProvider';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'The Garden | Restaurant, Café & Lounge – Wiener Neustadt',
  description: 'Willkommen im The Garden – Restaurant, Café und Lounge in Wiener Neustadt. Authentische österreichische und türkische Küche. Online bestellen & reservieren.',
  keywords: 'Restaurant, Café, Lounge, Wiener Neustadt, österreichische Küche, türkische Küche, Frühstück, Burger, Kebab, Online Bestellen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartSidebar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
