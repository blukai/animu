import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { API_URL } from '../../config'

const client = new ApolloClient({
  link: new HttpLink({ uri: `${API_URL}/${process.env.NODE_ENV}/graphql` }),
  cache: new InMemoryCache()
})

export default client
