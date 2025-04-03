import type { NextPage } from "next";
import { ConnectButton, ConnectEmbed, useActiveAccount, darkTheme } from "thirdweb/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import client from "../lib/client";
import { NETWORK } from "../const/contractAddresses";

const Home: NextPage = () => {
  const account = useActiveAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push(`/profile/${account.address}`);
    }
  }, [account, router]);

  return (
    <div className={styles.container}>
      <ConnectEmbed
        client={client}
        chain={NETWORK}
        style={{
          borderRadius: 0,
          backgroundSize: "cover",
          borderColor: "#17a1bf",
          color: "#17A1BF",
          filter: "drop-shadow(0px 0px 5px #00FF99)",
          fontFamily: "monospace",
          letterSpacing: "2px",
        }}
        showThirdwebBranding={false}
        className="font-extrabold uppercase"
        theme={darkTheme({
          colors: { 
            accentButtonBg: "#17a1bf", 
            danger: "#17a1bf" 
          },
        })}
        onConnect={() => {
          console.log("connected");
          if (account) {
            router.push(`/profile/${account.address}`);
          }
        }}
      />
      {account && (
        <>
          <ConnectButton 
            theme="dark"
            client={client}
            chain={NETWORK}
            style={{
              backgroundColor: "#17a1bf",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out"
            }}
          />
          <Link className={styles.link} href={`/profile/${account.address}`}>
            <Image
              className={styles.profileImage}
              src="/user-icon.png"
              width={42}
              height={42}
              alt="Profile"
            />
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;