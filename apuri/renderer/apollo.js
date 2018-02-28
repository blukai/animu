import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { API_URL } from '../config'

const { NODE_ENV } = process.env

export default new ApolloClient({
  link: new HttpLink({ uri: `${API_URL}/${NODE_ENV}/graphql` }),
  cache: new InMemoryCache()
})
