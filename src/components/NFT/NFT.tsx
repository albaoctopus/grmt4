import React, { useEffect, useState } from "react";
import { MediaRenderer } from "thirdweb/react";
import { NFT } from "thirdweb";
import { NFT_COLLECTION } from "../../const/contractAddresses";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import styles from "./NFT.module.css";
import Skeleton from "../Skeleton/Skeleton";

type Props = {
  tokenId: bigint;
  nft?: NFT;
  directListing?: DirectListing;
  auctionListing?: EnglishAuction;
  overrideOnclickBehavior?: (nft: NFT) => void;
};

export default function NFTComponent({
  tokenId,
  directListing,
  auctionListing,
  overrideOnclickBehavior,
  ...props
}: Props) {
  const [nft, setNFT] = useState(props.nft);

  useEffect(() => {
    if (nft?.id !== tokenId) {
      getNFT({
        contract: NFT_COLLECTION,
        tokenId: tokenId,
        includeOwner: true,
      }).then((nft) => {
        setNFT(nft);
      });
    }
  }, [tokenId, nft?.id]);

  if (!nft) {
    return <LoadingNFTComponent />;
  }

  return (
    <>
      <MediaRenderer
        src={nft.metadata.image}
        alt={nft.metadata.name || ""}
        client={client}
        className={styles.nftImage}
      />

      <p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p>
      <p className={styles.nftName}>{nft.metadata.name}</p>

      {(directListing || auctionListing) && (
        <div className={styles.priceContainer}>
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>
                {directListing
                  ? `${directListing.currencyValuePerToken.displayValue} ${directListing.currencyValuePerToken.symbol}`
                  : auctionListing
                  ? `${auctionListing.minimumBidCurrencyValue.displayValue} ${auctionListing.minimumBidCurrencyValue.symbol}`
                  : "Not for sale"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function LoadingNFTComponent() {
  return (
    <div>
      <Skeleton width="100%" height="312px" />
    </div>
  );
}