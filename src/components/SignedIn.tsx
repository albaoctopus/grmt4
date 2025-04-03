import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/SignedIn.module.css";
import client from "../lib/client";
import { NETWORK } from "../const/contractAddresses";

export function SignedIn() {
  const account = useActiveAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push(`/profile/${account.address}`);
    }
  }, [account, router]);

  return (
    <div className="p-20">
      <h1 className="flex text-center text-4xl tracking-tight justify-center">
        Welcome
      </h1>
      <div className="h-10" />
      <div className="flex justify-center">
        <ConnectButton
          theme="dark"
          client={client}
          chain={NETWORK}
          style={{
            backgroundColor: "#17a1bf",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}