import React from "react";
import { server, useQuery } from "../../lib/api";
import { 
  ListingArray, 
  DeleteListingVariables, 
  DeletedListing
} from "./types";
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

  // we will send in the type as a generic to say this is what we expect our data to look like when it's returned
  const { data, refetch } = useQuery<ListingArray>(LISTINGS);

  // tell useState that it's going to store an array of Listing types
  // since it can also be null we specify a union type
  // use state accepts a Type/Interface as shown below
  // const [ listings, setListings ] = useState<Listing[] | null>(null);
  // useQuery is a custom hook only accept a single argument 
  // accept graphql query that we want to make
  // return object, data
  // hook type define the data returned by our custom hook
  // const { data } = useQuery<ListingArray>(LISTINGS);

  // useEffect(() => {
    // on component did mount, api calls, subscribed? don't forget to unsubscribe with cleanup function
    // fetchListings();
    // if effect is dependent on a value that is prone to changing
    // and that value is not defined in dependencies list
    // it could lead to a source of bugs
    // react team recommends placing functions used in useEffect inside useEffect itself
  // }, []);

  // const fetchListings = async () => {
    // think about the data being returned 
    // how can we ensure that it's the shape we want it to be
    // where does the data first come in through?
    // server.fetch()
    // from this componet we can pass in the interface/type
    // into the fetch method
    // that fetch method will then receive the Type as an argument 
    // so go into the fetch method and add a Type paramater
    // const { data } = await server.fetch<ListingArray>({
    //   query: LISTINGS
    // });
    // setListings(data.listings);
  // }
  const deleteListing = async (id: string) => {
    await server.fetch<DeletedListing, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id: id
      }
    });
    // fetchListings();
    refetch();
  }

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <ul>
      {
        listings.map((listing) => {
          return (
            <li key={listing.id}>
              {listing.title}
              <button onClick={() => deleteListing(listing.id)}>
                Delete
              </button>
            </li>
          );
        })
      }
    </ul>
  ) : null;
  
  return (
    <>
      <h2>{title}</h2>
      {listingsList}
    </>
  );
};