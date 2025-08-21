import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type Ingredient {
    name: String!
    quantity: Float
    unit: String
  }

  input IngredientInput {
    name: String!
    quantity: Float
    unit: String
  }

  type User {
    id: ID!
    email: String!
    createdAt: Date!
  }

  type Recipe {
    id: ID!
    title: String!
    description: String
    category: String
    ingredients: [Ingredient!]!
    steps: [String!]!
    imageUrl: String
    prepTimeMins: Int
    cookTimeMins: Int
    servings: Int
    createdBy: User!
    createdAt: Date!
    updatedAt: Date!
  }

  input RecipeInput {
    title: String!
    description: String
    category: String
    ingredients: [IngredientInput!]
    steps: [String!]
    imageUrl: String
    prepTimeMins: Int
    cookTimeMins: Int
    servings: Int
  }

  input RecipeUpdateInput {
    title: String
    description: String
    category: String
    ingredients: [IngredientInput!]
    steps: [String!]
    imageUrl: String
    prepTimeMins: Int
    cookTimeMins: Int
    servings: Int
  }

  input RecipeFilter {
    q: String
    category: String
    minPrepTime: Int
    maxPrepTime: Int
  }

  type PageInfo {
    total: Int!
    page: Int!
    pageSize: Int!
    hasNextPage: Boolean!
  }

  type RecipeConnection {
    nodes: [Recipe!]!
    pageInfo: PageInfo!
  }

  type SignupResponse {
    token: String!
    user: User!
  }

  input SignupInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    health: String!
    recipe(id: ID!): Recipe
    recipes(filter: RecipeFilter, page: Int = 1, pageSize: Int = 10): RecipeConnection!
    categories: [String!]!
    me: User
  }

  type Mutation {
    addRecipe(input: RecipeInput!): Recipe!
    updateRecipe(id: ID!, input: RecipeUpdateInput!): Recipe!
    deleteRecipe(id: ID!): Boolean!
    signup(input: SignupInput!): SignupResponse!
    login(input: LoginInput!): SignupResponse!
  }
`;