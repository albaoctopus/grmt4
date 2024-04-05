import { ConnectWallet } from "@thirdweb-dev/react";

export function SignedIn() {
  return (
    <div className="p-20">
      <h1 className="flex text-center text-4xl tracking-tight justify-center">
        Welcome
      </h1>
      <div className="h-10" />
      <div className="flex justify-center">
        <ConnectWallet theme="dark" />
      </div>
    </div>
  );
}
