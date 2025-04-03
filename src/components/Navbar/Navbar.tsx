import { ConnectButton, useActiveAccount } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import client from "../../lib/client";
import { NETWORK } from "../../const/contractAddresses";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const account = useActiveAccount();

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/buy" className={styles.link}>
              Buy
            </Link>
            <Link href="/sell" className={styles.link}>
              Sell
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
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
          </div>
          {account && (
            <Link className={styles.link} href={`/profile/${account.address}`}>
              <Image
                className={styles.profileImage}
                src="/user-icon.png"
                width={42}
                height={42}
                alt="Profile"
              />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}