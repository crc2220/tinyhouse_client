import React from "react";
import { server } from "../../lib/api";
import { ListingArray, DeleteListingVariables, DeletedListing } from "./types";
// graphql queries don't require a name like below:
// "Listings" it can be anything you want it to be
// you could even omit it 
const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

// expecting a variable of ID in graphql we use ( $id: ID! )
// $id gets Typed as ID!
// $id gets sent down into gql schema mutation function as $id in (id: $id)
const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id){
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {

  // think about the data being returned 
  // how can we ensure that it's the shape we want it to be
  // where does the data first come in through?
  // server.fetch()
  // from this componet we can pass in the interface/type
  // into the fetch method
  // that fetch method will then receive the Type as an argument 
  // so go into the fetch method and add a Type paramater
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingArray>({
      query: LISTINGS
    });
    console.log(data.listings)
  }
  const deleteListing = async () => {
    const { data } = await server.fetch<DeletedListing, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id: "5e5296f7c03117a48cc9f6ac"
      }
    });
    console.log(data.deleteListing)
  }
  return (
    <>
      <h2>{title}</h2>
      <button onClick={fetchListings}>
        Query Listings!
      </button>
      <button onClick={deleteListing}>
        Delete Listing!
      </button>
    </>
  );
};