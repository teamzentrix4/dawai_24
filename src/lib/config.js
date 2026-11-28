/**
 * Global Dawai24 Site & Support Configuration
 * Keep key contact points like WhatsApp number easily configurable from one central location.
 */
export const SITE_CONFIG = {
  // WhatsApp Business Number (e.g. 918958622622 or your preferred business line)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918958622622",
  whatsappDefaultMessage: "Hello Dawai24! I need assistance with medicines.",
  supportPhone: "+91 89586 22622",
  supportEmail: "care@davai24.in",
};
