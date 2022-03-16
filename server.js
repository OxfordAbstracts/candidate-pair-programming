const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const features = require('./features.json')

const schema = buildSchema(`
  type Query {
      page_title: String
      page_subtitle: String
      features(id: Int): [Feature!]!
  }

  type Feature {
      id: Int!
      title: String!
      description: String
  }

  type Mutation { 
    set_feature_description(id: Int!, description: String!): Int!
  }

  `)

const root = {
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

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

const port = 4000;
app.listen(port, () => {
    console.info(`Running a GraphQL API server at http://localhost:${port}/graphql`)
})