import type { AppProps } from "next/app";
import { ThirdwebProvider } from "thirdweb/react";

import NextNProgress from "nextjs-progressbar";
import { NETWORK } from "../const/contractAddresses";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  if (!process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID) {
    throw new Error("Please add NEXT_PUBLIC_TEMPLATE_CLIENT_ID to your .env file");
  }

  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={NETWORK}
      supportedChains={[NETWORK]} // Add supported chains explicitly
    >
      {/* Progress bar when navigating between pages */}
      <NextNProgress
        color="#17a1bf"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      {/* Render the navigation menu */}
     
      
      {/* Render the actual component */}
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;