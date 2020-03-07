import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";

// these generated types come from the Schema created by our graphql server
// if our server changes schema then we just run the npm script to regenerate the types/interfaces
import { Listings as ListingArray } from "./__generated__/Listings";
import { DeleteListing as DeletedListing, DeleteListingVariables } from "./__generated__/DeleteListing";

// graphql queries don't require a name like below:
// "Listings" it can be anything you want it to be
// you could even omit it 
const LISTINGS = gql`
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
const DELETE_LISTING = gql`
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
  const { data, loading, error, refetch } = useQuery<ListingArray>(LISTINGS);
  const [deleteListing, { 
    loading: deleteListingLoading, 
    error: deleteListingError
   }] = useMutation<DeletedListing, DeleteListingVariables>(DELETE_LISTING);

  // useMutation will simply return a function you can call when you want to use it

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
  const handleDeleteListing = async (id: string) => {
    await deleteListing({ 
      variables: { id } 
    });
    // if you look at the deleteListing function you'll see that if there is an error a console.error is thrown
    // since console.error is thrown the refetch() below will not get called
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
              <button onClick={() => handleDeleteListing(listing.id)}>
                Delete
              </button>
            </li>
          );
        })
      }
    </ul>
  ) : null;
  if(loading){
    return <h2>loading...</h2>
  }
  if(error){
    return (
      <h2>
        Uh oh! Something went wrong - please try again laster.
      </h2>
    );
  }

  const deleteListingLoadingMessage = deleteListingLoading ? <h4>Deletion in progress...</h4> : null;
  const deleteListingErrorMessage = deleteListingError ? <h4>Deletion error please try again.</h4> : null;

  return (
    <>
      <h2>{title}</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </>
  );
};