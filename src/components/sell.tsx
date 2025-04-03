import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import React, { useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { NFT_COLLECTION, NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";
import tokenPageStyles from "../styles/Token.module.css";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import { NFT } from "thirdweb";
import { tokensOfOwner } from "thirdweb/extensions/erc721";
import client from "../lib/client";

export default function Sell() {
  const address = useActiveAccount();
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const [loading, setLoading] = React.useState(true);
  const [ownedNfts, setOwnedNfts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadNFTs = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const tokenIds = await tokensOfOwner({
          contract: NFT_COLLECTION,
          owner: address.address,
        });

        // Преобразуем tokenIds в формат для NFTGrid
        const nftData = tokenIds.map((tokenId) => ({
          tokenId: tokenId,
        }));

        setOwnedNfts(nftData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading NFTs:", error);
        setLoading(false);
      }
    };

    loadNFTs();
  }, [address]);

  return (
    <Container maxWidth="lg">
      <h1>Sell NFTs</h1>
      {!selectedNft ? (
        <>
          <p>Select which NFT you'd like to sell below.</p>
          <NFTGrid
            nftData={ownedNfts}
            isLoading={loading}
            overrideOnclickBehavior={(nft) => {
              setSelectedNft(nft);
            }}
            emptyText={
              "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
            }
          />
        </>
      ) : (
        <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
          <div className={tokenPageStyles.metadataContainer}>
            <div className={tokenPageStyles.imageContainer}>
              <MediaRenderer
                src={selectedNft.metadata.image}
                className={tokenPageStyles.image}
                client={client}
              />
              <button
                onClick={() => {
                  setSelectedNft(undefined);
                }}
                className={tokenPageStyles.crossButton}
              >
                X
              </button>
            </div>
          </div>

          <div className={tokenPageStyles.listingContainer}>
            <p>You're about to list the following item for sale.</p>
            <h1 className={tokenPageStyles.title}>
              {selectedNft.metadata.name}
            </h1>
            <p className={tokenPageStyles.collectionName}>
              Token ID #{selectedNft.metadata.id}
            </p>

            <div className={tokenPageStyles.pricingContainer}>
              <SaleInfo nft={selectedNft} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}