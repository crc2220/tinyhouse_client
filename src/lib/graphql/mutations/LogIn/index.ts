import { gql } from "apollo-boost";

// helpful variables you can use to do queries on frontend
export const LOG_IN = gql`
  query LogIn($input: LogInInput) {
    logIn(input: $input) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
