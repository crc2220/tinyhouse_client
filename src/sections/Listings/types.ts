interface Listing {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}
export type ListingArray = {
    listings: Listing[];
};
export type DeletedListing = {
    deleteListing: Listing;
};
export type DeleteListingVariables = {
    id: string;
};