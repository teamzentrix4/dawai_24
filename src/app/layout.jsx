import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat/page";
import AppChrome from "@/components/Common/AppChrome";

export const metadata={title:{default:"Dawai24 – Online Pharmacy",template:"%s | Dawai24"},description:"Shop medicines and healthcare products from the live Dawai24 catalogue."};
export const viewport={width:"device-width",initialScale:1};

export default function RootLayout({children}){
  return <html lang="en"><body className="font-sans antialiased"><AppChrome>{children}</AppChrome> <WhatsAppFloat /> </body></html>;
}
