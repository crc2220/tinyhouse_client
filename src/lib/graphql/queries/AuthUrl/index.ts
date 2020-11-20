import { gql } from "apollo-boost";

// helpful variables you can use to do queries on frontend
export const AUTH_URL = gql`
  query AuthUrl {
    authUrl
  }
`;
