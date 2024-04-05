import type { NextPage } from "next";
import { ConnectEmbed, darkTheme, ConnectWallet, useAddress, useContract, useTokenBalance, Theme } from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push(`/profile/${address}`);
    }
  }, [address, router]);

  return (
    <div className={styles.container}>
      <ConnectEmbed
        style={{
          
          borderRadius: 0,
          backgroundSize: "cover",
          borderColor: "#17a1bf", /* Neon accent border */
          color: "#17A1BF", /* Neon green text */
          filter: "drop-shadow(0px 0px 5px #00FF99)",
          fontFamily: "monospace",
          letterSpacing: "2px",
        }}
        showThirdwebBranding={false}
        className="font-extrabold uppercase"
        theme={darkTheme({
          colors: { accentButtonBg: " #17a1bf", danger: "#17a1bf" },
          
        })}
      />
      {address && (
        <>
          <ConnectWallet />
          <Link className={styles.link} href={`/profile/${address}`}>
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
