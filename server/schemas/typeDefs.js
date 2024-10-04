const typeDefs = `

  type Doctor {
    username: String!
  }

  # required for login
  type Auth {
    token: ID!
    doctor: Doctor
  }

  type Query {
    # should allow us to check the logged in doctor when queried
    me: Doctor
  }

  type Mutation {
    # mutation to login
    login(username: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
