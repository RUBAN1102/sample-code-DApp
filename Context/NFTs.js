import {
  useAddress,
  //NEW HOOKS FOR FRONTEND
  useSigner,
} from "@thirdweb-dev/react";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getContract,
  prepareContractCall,
  readContract
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "../pages/client";

import { ethers } from "ethers";

const StateContext = createContext();
const contract = getContract({
  client,
  address: "0x9b4730cf599a39e6a3061d10bfd9c55fa7d292bb",
  chain: sepolia,
});

export const StateContextProvider = ({ children }) => {
  const address = useAddress();
  const { mutate: sendTransaction } = useSendTransaction();
  const { data, isLoading } = useReadContract({
    contract,
    method: "function tokenURI(uint256 tokenId) returns (string)",
    params: [1n], // type safe params
  });

  //FRONTEND
  const signer = useSigner();
  const [userBlance, setUserBlance] = useState();
  const [loading, setloading] = useState(false);

  const fetchData = async () => {
    try {
      //USER BLANCE
      const balance = await signer?.getBalance();
      const userBalance = address
        ? ethers.utils.formatEther(balance?.toString())
        : "";
      setUserBlance(userBalance);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //CONTRACT FUNCTION
  //---UPLOAD
  const UploadImage = async (imageInfo) => {
    const { title, description, email, category, image } = imageInfo;

    try {
      //CHARGE
      const listingPrice = await readContract({
        contract,
        method: "function listingPrice() view returns (uint256)",
        params: [],
      });

      console.log(listingPrice);
      const createNFTs = prepareContractCall({
        contract,
        method:
          "function uploadIPFS(address , string _image, string title, string description, string email, string category) payable returns (string, string, string, address, string)",
        params: [address, image, title, description, email, category],
      });

      const transactionHash = sendTransaction(createNFTs);

      //API CALL
      const response = await axios({
        method: "POST",
        url: `/api/v1/NFTs`,
        data: {
          title: title,
          description: description,
          category: category,
          image: image,
          address: address,
          email: email,
        },
      });

      console.log(response);
      console.info("contract call success", createNFTs);

      setloading(false);
      // window.location.reload();
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  //--GET CONTRACT DATA
  const getUploadedImages = async () => {
    //ALL IMAGES

    const response = await axios({
      method: "GET",
      url: `/api/v1/NFTs`,
    });
    const images = response.data.data.nfts;
    // const images = await contract.call("getAllNFTs");

    // TOTAL UPLOAD
    const totalUpload = await readContract({
      contract,
      method: "function imagesCount() view returns (uint256)",
      params: [],
    });
    //LISTING PRICE
    const listingPrice = await readContract({
      contract,
      method: "function listingPrice() view returns (uint256)",
      params: [],
    });
    const allImages = images.map((images, i) => ({
      owner: images.creator,
      title: images.title,
      description: images.description,
      email: images.email,
      category: images.category,
      fundraised: images.fundraised,
      image: images.image,
      imageID: images._id,
      createdAt: images.createdAt,
      // listedAmount: ethers.utils.formatEther(listingPrice.toString()),
      // totalUpload: totalUpload.toNumber(),
    }));

    return allImages;
  };

  //--GET SINGLE IMAGE
  const singleImage = async (id) => {
    
    
    try {
      const response = await axios({
        method: "GET",
        url: `/api/v1/NFTs/${id}`,
      });
      const data = response.data.data.nft;

const {title,description,email,category,image:imageURL,_id:imageID,createdAt}=data
      const image = {
        title,
        description,
        email,
        category,
        imageURL,
        createdAt,
        imageID,
      };

      return image;
    } catch (error) {
      console.log(error);
    }
  };

  //DONATE
  const donateFund = async ({ amount, Id }) => {
    try {
      console.log(amount, Id);
      const transaction = null;
      console.log(transaction);
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //GET API DATA
  const getAllNftsAPI = async () => {
    const response = await axios({
      method: "GET",
      url: "/api/v1/NFTs",
    });
    // console.log(response);
  };

  //SINGLE NFTS API
  const getSingleNftsAPI = async (id) => {
    const response = await axios({
      method: "GET",
      url: `/api/v1/NFTs${id}`,
    });
    console.log(response);
  };

  return (
    <StateContext.Provider
      value={{
        //CONTRACT
        address,
        contract,
        userBlance,
        setloading,
        loading,
        //FUNCTION
        UploadImage,
        getUploadedImages,
        donateFund,
        singleImage,
        //API
        getAllNftsAPI,
        getSingleNftsAPI,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
