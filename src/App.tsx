import React from "react";
import "./App.css";
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Main from "./Components/Main";
import { jsx } from "@emotion/react";

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ locations, message, path }) => {
            alert(`graphql error ${message}`);
        });
    }
});

const link = from([errorLink, new HttpLink({ uri: "https://wpe-hiring.tokopedia.net/graphql" })]);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
});

function App() {
    return (
        <ApolloProvider client={client}>
            <React.Fragment>
                <Main></Main>
            </React.Fragment>
        </ApolloProvider>
    );
}

export default App;
