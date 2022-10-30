import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Header from "../components/Header";

type Props = {};

function AddItem({}: Props) {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  const mintNFT = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) return;
    if (!image) {
      alert("please select an image");
      return;
    }
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metaData = {
      name: target.name.value,
      description: target.description.value,
      image: image, //image URL / file
    };
    try {
      const transaction = await contract.mintTo(address, metaData);

      const receipt = transaction.receipt; //recipient
      const tokenId = transaction.id;
      const nft = await transaction.data();
      console.log(receipt, tokenId, nft);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add item to the Marketplace</h1>
        <h2 className="text-xl font-semibold">Item Details</h2>
        <p className="pb-5">
          By adding the item to marketplace, you're essentially Minting an NFT
          of the item into your wallet which can then listed for the sale!
        </p>
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <img
            className="border h-80 w-80 object-contain"
            src={preview || "https://links.papareact.com/ucj"}
            alt="Bag"
          />
          <form
            onSubmit={mintNFT}
            className="flex flex-col flex-1 p-2 space-y-2"
          >
            <label className="font-light" htmlFor="">
              Name of item
            </label>
            <input
              className="formField"
              placeholder="Name of item..."
              type="text"
              name="name"
              id="name"
            />
            <label className="font-light" htmlFor="">
              Description
            </label>
            <input
              className="formField"
              placeholder="Description..."
              type="text"
              name="description"
              id="description"
            />
            <label className="font-light" htmlFor="">
              Image of item
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />

            <button
              type="submit"
              className=" bg-blue-500 text-white font-sm py-2 px-10 mt-auto mc-auto md:ml-auto justify-center rounded cursor-pointer w-25"
            >
              Add / Mint item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddItem;
