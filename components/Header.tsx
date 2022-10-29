import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

type Props = {};

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-12xl mx-auto px-6">
      <nav className=" flex justify-between">
        <div className="felx items-center space-x-4 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetamask} className="connectWalletBtn">
              Connect Your wallet
            </button>
          )}
          <p className="header-link">Daily Deals</p>
          <p className="header-link">Help & Contact</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p className="header-link">Ship to</p>
          <p className="header-link">Sell</p>
          <p className="header-link">Watch list</p>
          <Link className="flex items-center hover:link" href="/addItem">
            Add to Inventory
            <ChevronDownIcon className="h-4" />
          </Link>
          <BellIcon className="h-6 w-6" />
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
      </nav>
      <hr className="mt-2" />

      <section className="flex items-center space-x-3 py-5 justify-center">
        <div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              alt="logo"
              src="https://links.papareact.com/bdb"
              width={100}
              height={100}
              className="h-full w-full object-contain"
            />
          </Link>
        </div>
        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p className="text-gray-600 text-sm">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>

        <div className="flex items-center px-5 space-x-2 md:px-5 py-2 border-black border-2">
          <MagnifyingGlassIcon className="w-5 text-gray-400" />
          <input
            className="flex-1 outline-none"
            placeholder="Search for anything .."
            type="text"
          />
        </div>
        <button className="hidden sm:inline bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-600">
          Search
        </button>
        <Link href="/create">
          <button className="px-5 border-2 border-blue-600 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">
            List Item
          </button>
        </Link>
      </section>
      <hr />
      <section className="flex py-3 space-x-6 text-xs md:text-sm whitespace-nowrap justify-center px-6">
        <p className="link">Home</p>
        <p className="link">Electronics</p>
        <p className="link">Computers</p>
        <p className="link hidden sm:inline">Video Games</p>
        <p className="link hidden sm:inline">Home & Garden</p>
        <p className="link hidden md:inline">Health & Beauty</p>
        <p className="link hidden lg:inline">Collectibles & Art</p>
        <p className="link hidden lg:inline">Books</p>
        <p className="link hidden lg:inline">Musics</p>
        <p className="link hidden xl:inline">Deals</p>
        <p className="link hidden xl:inline">Others</p>
        <p className="link ">More</p>
      </section>
    </div>
  );
}

export default Header;
