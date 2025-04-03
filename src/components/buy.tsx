import { useContract } from "thirdweb/react";
import React from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE } from "../const/contractAddresses";
import { getAllValidListings, getAllValidAuctions } from "thirdweb/extensions/marketplace";

export default function Buy() {
  const [loading, setLoading] = React.useState(true);
  const [nftData, setNftData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadListings = async () => {
      try {
        const [listings, auctions] = await Promise.all([
          getAllValidListings({
            contract: MARKETPLACE,
          }),
          getAllValidAuctions({
            contract: MARKETPLACE,
          }),
        ]);

        // Получаем все tokenIds из листингов и аукционов
        const tokenIds = Array.from(
          new Set([
            ...listings
              .filter((l) => l.assetContractAddress === NFT_COLLECTION_ADDRESS)
              .map((l) => l.tokenId),
            ...auctions
              .filter((a) => a.assetContractAddress === NFT_COLLECTION_ADDRESS)
              .map((a) => a.tokenId),
          ])
        );

        // Формируем данные для NFTGrid
        const nftData = tokenIds.map((tokenId) => {
          return {
            tokenId: tokenId,
            directListing: listings.find((listing) => listing.tokenId === tokenId),
            auctionListing: auctions.find((auction) => auction.tokenId === tokenId),
          };
        });

        setNftData(nftData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading listings:", error);
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <Container maxWidth="lg">
      <h1>Buy NFTs</h1>
      <p>Browse which NFTs are available from the collection.</p>
      <NFTGrid
        nftData={nftData}
        isLoading={loading}
        emptyText={
          "Looks like there are no NFTs in this collection. Did you import your contract on the thirdweb dashboard?"
        }
      />
    </Container>
  );
}