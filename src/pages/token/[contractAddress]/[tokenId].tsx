import React, { useState } from "react";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import {
  ETHERSCAN_URL,
  MARKETPLACE,
  NFT_COLLECTION,
  NFT_COLLECTION_ADDRESS,
} from "../../../const/contractAddresses";
import styles from "../../../styles/Token.module.css";
import Link from "next/link";
import randomColor from "../../../util/randomColor";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";
import { getAllValidListings, getAllValidAuctions, buyFromListing, buyoutAuction } from "thirdweb/extensions/marketplace";
import { getNFT } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";
import client from "../../../lib/client";

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

type Props = {
  nft: any;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [bidValue, setBidValue] = useState<string>();
  const address = useActiveAccount();

  return (
    <Container maxWidth="lg">
      <div className={styles.container}>
        <div className={styles.metadataContainer}>
          <MediaRenderer
            src={nft.metadata.image}
            className={styles.image}
            client={client}
          />

          <div className={styles.descriptionContainer}>
            <h3 className={styles.descriptionTitle}>Description</h3>
            <p className={styles.description}>{nft.metadata.description}</p>

            <h3 className={styles.descriptionTitle}>Traits</h3>
            <div className={styles.traitsContainer}>
              {nft.metadata.attributes.map((trait: any, index: number) => (
                <div className={styles.traitContainer} key={index}>
                  <p className={styles.traitName}>{trait.trait_type}</p>
                  <p className={styles.traitValue}>{trait.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.listingContainer}>
          {contractMetadata && (
            <div className={styles.contractMetadataContainer}>
              <MediaRenderer
                src={contractMetadata.image}
                className={styles.collectionImage}
                client={client}
              />
              <p className={styles.collectionName}>{contractMetadata.name}</p>
            </div>
          )}
          <h1 className={styles.title}>{nft.metadata.name}</h1>
          <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>

          <Link
            href={`/profile/${nft.owner}`}
            className={styles.nftOwnerContainer}
          >
            <div
              className={styles.nftOwnerImage}
              style={{
                background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
              }}
            />
            <div className={styles.nftOwnerInfo}>
              <p className={styles.label}>Current Owner</p>
              <p className={styles.nftOwnerAddress}>
                {nft.owner.slice(0, 8)}...{nft.owner.slice(-4)}
              </p>
            </div>
          </Link>

          {/* Листинги и ставки */}
          <div className={styles.pricingContainer}>
            <input
              className={styles.input}
              type="number"
              step={0.000001}
              placeholder="Place a Bid"
              value={bidValue}
              onChange={(e) => setBidValue(e.target.value)}
            />
            <TransactionButton
              transaction={async () => {
                if (!address) throw new Error("No account connected");
                if (!bidValue) throw new Error("No bid value set");
                
                // Логика покупки или ставки
                return buyFromListing({
                  contract: MARKETPLACE,
                  listingId: nft.id,
                  quantity: 1,
                  buyer: address.address
                });
              }}
              onSuccess={() => {
                toast.success("Purchase successful!", {
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onError={(error) => {
                toast.error(`Purchase failed! ${error.message}`, {
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
            >
              Buy Now
            </TransactionButton>
          </div>
        </div>
      </div>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  try {
    const nft = await getNFT({
      contract: NFT_COLLECTION,
      tokenId: BigInt(tokenId),
      includeOwner: true
    });

    let contractMetadata;
    try {
      contractMetadata = await NFT_COLLECTION.metadata.get();
    } catch (e) {}

    return {
      props: {
        nft,
        contractMetadata: contractMetadata || null,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};