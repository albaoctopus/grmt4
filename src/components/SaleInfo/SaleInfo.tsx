import { NFT as NFTType } from "thirdweb";
import React, { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { ADDRESS_ZERO } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { MARKETPLACE, NFT_COLLECTION } from "../../const/contractAddresses";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import { TransactionButton } from "thirdweb/react";
import { createListing, createAuction } from "thirdweb/extensions/marketplace";

type Props = {
  nft: NFTType;
};

export default function SaleInfo({ nft }: Props) {
  const router = useRouter();
  const account = useActiveAccount();
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  const { data: hasApproval } = useReadContract(isApprovedForAll, {
    contract: NFT_COLLECTION,
    owner: account?.address || ADDRESS_ZERO,
    operator: MARKETPLACE.address,
  });

  const [directListingState, setDirectListingState] = useState({
    price: "0",
  });

  const [auctionListingState, setAuctionListingState] = useState({
    minimumBidAmount: "0",
    buyoutPrice: "0",
  });

  return (
    <>
      <div className={profileStyles.tabs}>
        <h3
          className={`${profileStyles.tab} ${tab === "direct" ? profileStyles.activeTab : ""}`}
          onClick={() => setTab("direct")}
        >
          Direct
        </h3>
        <h3
          className={`${profileStyles.tab} ${tab === "auction" ? profileStyles.activeTab : ""}`}
          onClick={() => setTab("auction")}
        >
          Auction
        </h3>
      </div>

      <div className={tab === "direct" ? styles.activeTabContent : profileStyles.tabContent}>
        <legend className={styles.legend}>Price per token</legend>
        <input
          className={styles.input}
          type="number"
          step={0.000001}
          value={directListingState.price}
          onChange={(e) => setDirectListingState({ price: e.target.value })}
        />

        <TransactionButton
          transaction={async () => {
            if (!account) throw new Error("No account");
            return createListing({
              contract: MARKETPLACE,
              assetContractAddress: NFT_COLLECTION.address,
              tokenId: nft.id,
              pricePerToken: directListingState.price,
            });
          }}
          onSuccess={() => {
            toast.success("Listed Successfully!", {
              style: toastStyle,
              position: "bottom-center",
            });
            router.push(`/token/${NFT_COLLECTION.address}/${nft.id}`);
          }}
          onError={(error) => {
            toast.error(`Error listing: ${error.message}`, {
              style: toastStyle,
              position: "bottom-center",
            });
          }}
        >
          Create Direct Listing
        </TransactionButton>
      </div>

      <div className={tab === "auction" ? styles.activeTabContent : profileStyles.tabContent}>
        <legend className={styles.legend}>Minimum bid amount</legend>
        <input
          className={styles.input}
          type="number"
          step={0.000001}
          value={auctionListingState.minimumBidAmount}
          onChange={(e) =>
            setAuctionListingState({
              ...auctionListingState,
              minimumBidAmount: e.target.value,
            })
          }
        />

        <legend className={styles.legend}>Buyout price</legend>
        <input
          className={styles.input}
          type="number"
          step={0.000001}
          value={auctionListingState.buyoutPrice}
          onChange={(e) =>
            setAuctionListingState({
              ...auctionListingState,
              buyoutPrice: e.target.value,
            })
          }
        />

        <TransactionButton
          transaction={async () => {
            if (!account) throw new Error("No account");
            return createAuction({
              contract: MARKETPLACE,
              assetContractAddress: NFT_COLLECTION.address,
              tokenId: nft.id,
              minimumBidAmount: auctionListingState.minimumBidAmount,
              buyoutBidAmount: auctionListingState.buyoutPrice,
            });
          }}
          onSuccess={() => {
            toast.success("Auction Created Successfully!", {
              style: toastStyle,
              position: "bottom-center",
            });
            router.push(`/token/${NFT_COLLECTION.address}/${nft.id}`);
          }}
          onError={(error) => {
            toast.error(`Error creating auction: ${error.message}`, {
              style: toastStyle,
              position: "bottom-center",
            });
          }}
        >
          Create Auction
        </TransactionButton>
      </div>
    </>
  );
}