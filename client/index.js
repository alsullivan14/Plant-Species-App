import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import './style/style.css'

import GenusList from './components/GeneraList';
import GenusCreate from './components/GenusCreate';
import GenusDetail from './components/GenusDetail';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id || null
});

const client = new ApolloClient({
  link: createHttpLink({ uri: "/graphql" }),
  cache
});
const Root = () => {
  return (
      <ApolloProvider client={client}>
        <HashRouter >
            <Route exact path="/" component={GenusList} /> 
            <Route exact path="/genus/new" component={GenusCreate} />
            <Route path="/genus/:id" component={GenusDetail} />
        </HashRouter>
      </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);