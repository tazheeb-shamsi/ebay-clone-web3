import {
  MediaRenderer,
  useAddress,
  useContract,
  useCreateDirectListing,
  useCreateAuctionListing,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, NFT, ChainId } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Header from "../components/Header";
import network from "../utils/network";

type Props = {};

function listItem({}: Props) {
  const address = useAddress();
  const router = useRouter();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const OwnedNfts = useOwnedNFTs(collectionContract, address);
  console.log("ADDRESS:", address);
  console.log("COLLECTIONS:", collectionContract);

  const [selectedNft, setSelectedNft] = useState<NFT>();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateAuctionListing(contract);

  const networkMissmatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (networkMissmatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7 * 53, //1year
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS: ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR:", error, variables, context);
            router.push("/");
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7 * 53,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("AUCTION__SUCCESS: ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR_IN_AUCTION:", error, variables, context);
            router.push("/");
          },
        }
      );
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-2 ">
        <h1 className="text-4xl font-bold">List an item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an item you would like to sell{" "}
        </h2>
        <hr className="mb-5" />
        <p>Below you'll find NFT's you own in your wallet</p>

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {OwnedNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => {
                setSelectedNft(nft);
              }}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-200 ${
                nft.metadata.id === selectedNft?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-sm"
                src={nft.metadata.image}
              />
              <p className="truncate text-lg font-bold">{nft.metadata.name}</p>
              <p className="truncate text-xs">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNft && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col p-10 ">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r pr-2 font-light" htmlFor="">
                  Direct Listing / Fixed Price
                </label>
                <input
                  name="listingType"
                  type="radio"
                  value="directLinsting"
                  className="ml-auto h-7 w-7"
                />

                <label className="border-r pr-2 font-light" htmlFor="">
                  Auction
                </label>
                <input
                  name="listingType"
                  type="radio"
                  value="auctionListing"
                  className="ml-auto h-7 w-7"
                />

                <label className="border-r pr-2 font-light ">Price</label>
                <input
                  type="text"
                  placeholder="0.05"
                  name="price"
                  className="bg-gray-100 p-5 h-7 border-none"
                />
              </div>
              <button
                className="bg-blue-600 text-white ml-auto rounded-sm p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default listItem;
