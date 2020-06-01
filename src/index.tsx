import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Home, Host, Listing, Listings, NotFound, User } from "./sections";
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css";
// Apollo Boost has pre-built config for caching, state management, and error handling
const client = new ApolloClient({
    // since we're proxying localhost:9000 in package.json we can just do "/api"
    uri: "/api",
});

const App = () => {
    return (
        <Router>
            <Switch>
                {/* you want `exact` in the route to avoid partial matching pitfalls when using Switch  */}
                <Route exact path="/" component={Home} />
                <Route exact path="/host" component={Host} />
                <Route exact path="/listing/:id" component={Listing} />
                <Route exact path="/listings/:location?" component={Listings} />
                <Route exact path="/user/:id" component={User} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,

    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
