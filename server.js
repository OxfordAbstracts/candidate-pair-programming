const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const features = require('./features.json')
const cors = require('cors');

const schema = buildSchema(`
  type Query {
      hello(name: String): String!
      page_title: String!
      page_subtitle: String
      features(id: Int): [Feature!]!
  }

  type Feature {
      id: Int!
      title: String!
      description: String
      image: String
  }

  type Mutation { 
    set_feature_description(id: Int!, description: String!): Int!
  }

  `)

const root = {
    hello: ({name}) => `Hello ${name || 'anonymous'}`,
    page_title: () => 'Just some of the features',
    page_subtitle: () => 'Here\'s just a glimpse at some of the amazing things you can do using the platform.',
    features: ({ id }) =>
        features.filter(w => !id || id === w.id),
    set_feature_description: ({ id, description }) => {
        let count = 0
        features.forEach((w) => {
            if (w.id === id) {
                w.description = description
                count++
            }
        })
        return count
    }
}

const app = express()
app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

const port = 4000;
app.listen(port, () => {
    console.info(`Running a GraphQL API server at http://localhost:${port}/graphql`)
})