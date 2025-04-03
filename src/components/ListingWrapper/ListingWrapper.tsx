import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import Link from "next/link";
import React from "react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import styles from "../../styles/Buy.module.css";
import NFT from "../NFT/NFT";
import Skeleton from "../Skeleton/Skeleton";
import { getNFT } from "thirdweb/extensions/erc721";
import { NFT_COLLECTION } from "../../const/contractAddresses";

type Props = {
  listing: DirectListing | EnglishAuction;
};

export default function ListingWrapper({ listing }: Props) {
  const [nft, setNft] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadNFT() {
      try {
        const nft = await getNFT({
          contract: NFT_COLLECTION,
          tokenId: listing.tokenId,
        });
        setNft(nft);
        setLoading(false);
      } catch (error) {
        console.error("Error loading NFT:", error);
        setLoading(false);
      }
    }
    loadNFT();
  }, [listing.tokenId]);

  if (loading) {
    return (
      <div className={styles.nftContainer}>
        <Skeleton width="100%" height="312px" />
      </div>
    );
  }

  if (!nft) return null;

  return (
    <Link
      href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
      key={nft.metadata.id}
      className={styles.nftContainer}
    >
      <NFT
        tokenId={nft.id}
        nft={nft}
        directListing={"assetContractAddress" in listing ? listing as DirectListing : undefined}
        auctionListing={"minimumBidCurrencyValue" in listing ? listing as EnglishAuction : undefined}
      />
    </Link>
  );
}