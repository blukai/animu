import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const { LAMBDA_URL, NODE_ENV } = process.env

export default new ApolloClient({
  link: new HttpLink({ uri: `${LAMBDA_URL}/${NODE_ENV}/graphql` }),
  cache: new InMemoryCache()
})
