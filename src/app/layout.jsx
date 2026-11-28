import "./globals.css";
import WhatsAppFloat from "@/components/Common/WhatsAppFloat";
import AppChrome from "@/components/Common/AppChrome";
import { getPublicCategories } from "@/lib/publicCategories";

export const metadata={title:{default:"Dawai24 – Online Pharmacy",template:"%s | Dawai24"},description:"Shop medicines and healthcare products from the live Dawai24 catalogue."};
export const viewport={width:"device-width",initialScale:1};

export default async function RootLayout({children}){
  const categories = await getPublicCategories();
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppChrome categories={categories}>
          {children}
        </AppChrome>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
