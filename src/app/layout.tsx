import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/app-context";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "SmogShield | Clean-Air & Urban Smog Navigator",
  description: "GenAI-powered clean-air assistant helping families and communities navigate severe winter smog and urban air pollution.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-background text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 pb-24 pt-4 px-3 sm:px-6 max-w-4xl mx-auto w-full">
              {children}
            </main>
          </div>
        </AppProvider>

        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SmogShield SW registered: ', registration.scope);
                    },
                    function(err) {
                      console.log('SmogShield SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
