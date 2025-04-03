import type { NFT as NFTType } from "thirdweb";
import Link from "next/link";
import React from "react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import styles from "../../styles/Buy.module.css";
import NFT from "./NFT";
import Skeleton from "../Skeleton/Skeleton";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";

type Props = {
  nftData: {
    tokenId: bigint;
    nft?: NFTType;
    directListing?: DirectListing;
    auctionListing?: EnglishAuction;
  }[];
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  nftData,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
}: Props) {
  if (nftData && nftData.length > 0) {
    return (
      <div className={styles.nftGridContainer}>
        {nftData.map((nft) => (
          <div key={nft.tokenId.toString()} className={styles.nftContainer}>
            {!overrideOnclickBehavior ? (
              <Link
                href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.tokenId}`}
                className={styles.nftContainer}
              >
                <NFT {...nft} />
              </Link>
            ) : (
              <div
                className={styles.nftContainer}
                onClick={() => nft.nft && overrideOnclickBehavior(nft.nft)}
              >
                <NFT {...nft} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.nftGridContainer}>
      <p>{emptyText}</p>
    </div>
  );
}

export function NFTGridLoading() {
  return (
    <div className={styles.nftGridContainer}>
      {[...Array(20)].map((_, index) => (
        <div key={index} className={styles.nftContainer}>
          <Skeleton key={index} width="100%" height="312px" />
        </div>
      ))}
    </div>
  );
}