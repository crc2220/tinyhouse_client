import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Listings } from "./sections";
import * as serviceWorker from "./serviceWorker";

// Apollo Boost has pre-built config for caching, state management, and error handling
const client = new ApolloClient({
    // since we're proxying localhost:9000 in package.json we can just do "/api"
    uri: "/api"
});

render(

    <ApolloProvider client={client}>
        <Listings title="TinyHouse Listings" />
    </ApolloProvider>, 

    document.getElementById("root")

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
