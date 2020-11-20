import { gql } from "apollo-boost";

// helpful variables you can use to do queries on frontend
export const LOG_OUT = gql`
  query LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
