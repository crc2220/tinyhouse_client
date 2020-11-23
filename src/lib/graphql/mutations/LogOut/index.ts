import { gql } from "@apollo/client";

// helpful variables you can use to do queries on frontend
export const LOG_OUT = gql`
  mutation LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
