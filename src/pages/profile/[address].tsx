import { ConnectButton } from "thirdweb/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Container from "../../components/Container/Container";
import NFTGrid from "../../components/NFT/NFTGrid";
import {
  MARKETPLACE,
  NFT_COLLECTION,
} from "../../const/contractAddresses";
import styles from "../../styles/Profile.module.css";
import randomColor from "../../util/randomColor";
import Image from 'next/image';
import { getAllValidListings, getAllValidAuctions } from "thirdweb/extensions/marketplace";
import { getNFTsForOwner } from "thirdweb/extensions/erc721";
import client from "../../lib/client";

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
];

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"nfts" | "listings" | "auctions">("nfts");
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);

  const { address } = router.query;

  useEffect(() => {
    async function loadData() {
      if (!address || typeof address !== 'string') return;

      try {
        setLoading(true);

        // Загрузка NFT
        const ownedNfts = await getNFTsForOwner({
          contract: NFT_COLLECTION,
          owner: address,
        });

        const nftData = ownedNfts.map(nft => ({
          tokenId: nft.id,
          nft
        }));
        setNfts(nftData);

        // Загрузка листингов и аукционов
        const [validListings, validAuctions] = await Promise.all([
          getAllValidListings({
            contract: MARKETPLACE,
            seller: address
          }),
          getAllValidAuctions({
            contract: MARKETPLACE,
            seller: address
          })
        ]);

        setListings(validListings);
        setAuctions(validAuctions);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address]);

  return (
    <Container maxWidth="lg">
      <div className={styles.profileHeader}>
        <div
          className={styles.coverImage}
          style={{
            background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/GM_Logo.png"
            alt="Cover Image"
            width={300}
            height={300}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
        <ConnectButton
          theme="dark"
          client={client}
          style={{
            marginTop: "15px",
            backgroundColor: "#17a1bf",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer"
          }}
        />
      </div>

      <div className={styles.tabs}>
        <h3
          className={`${styles.tab} ${tab === "nfts" ? styles.activeTab : ""}`}
          onClick={() => setTab("nfts")}
        >
          CERTIFICATES
        </h3>
        <h3
          className={`${styles.tab} ${tab === "listings" ? styles.activeTab : ""}`}
          onClick={() => setTab("listings")}
        >
          Listings
        </h3>
        <h3
          className={`${styles.tab} ${tab === "auctions" ? styles.activeTab : ""}`}
          onClick={() => setTab("auctions")}
        >
          Auctions
        </h3>
      </div>

      <div className={`${tab === "nfts" ? styles.activeTabContent : styles.tabContent}`}>
        <NFTGrid
          nftData={nfts}
          loading={loading}
          emptyText="Looks like you don't have any NFTs from this collection."
        />
      </div>

      <div className={`${tab === "listings" ? styles.activeTabContent : styles.tabContent}`}>
        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          <NFTGrid
            nftData={listings.map(listing => ({
              tokenId: listing.tokenId,
              directListing: listing
            }))}
            loading={loading}
            emptyText="No listings found."
          />
        )}
      </div>

      <div className={`${tab === "auctions" ? styles.activeTabContent : styles.tabContent}`}>
        {loading ? (
          <p>Loading...</p>
        ) : auctions.length === 0 ? (
          <p>No auctions yet! Head to the sell tab to create an auction.</p>
        ) : (
          <NFTGrid
            nftData={auctions.map(auction => ({
              tokenId: auction.tokenId,
              auctionListing: auction
            }))}
            loading={loading}
            emptyText="No auctions found."
          />
        )}
      </div>
    </Container>
  );
}