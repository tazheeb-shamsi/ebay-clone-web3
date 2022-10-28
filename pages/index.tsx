import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import Header from "../components/Header";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  return (
    <div className="">
      <Header />

      <main className="max-w-6xl mx-auto py-2 px-6">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading listings...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mx-auto">
            {listings?.map((listings) => (
              <div
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
                key={listings.id}
              >
                <div className="flex-1 flex flex-col pb-2 items-center">
                  <MediaRenderer className="w-44" src={listings.asset.image} />
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <h2 className="truncate text-lg ">{listings.asset.name}</h2>
                    <hr />
                    <p className="truncate text-sm text-gray-600 mt-2">
                      {listings.asset.description}
                    </p>
                  </div>
                  <p>
                    <span className="font-bold mr-1">
                      {listings.buyoutCurrencyValuePerToken.displayValue}
                    </span>
                    {listings.buyoutCurrencyValuePerToken.symbol}
                  </p>

                  <div
                    className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                      listings.type === ListingType.Direct
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    <p>
                      {listings.type === ListingType.Direct
                        ? "Buy Now"
                        : "Auction"}
                    </p>
                    {listings.type === ListingType.Direct ? (
                      <BanknotesIcon className="h-4" />
                    ) : (
                      <ClockIcon className="h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
