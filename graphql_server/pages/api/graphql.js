// history: REST APIs (gives you back all properties including those you dont need) used to be the only way, until 3 facebook developers (netflix developers) invented a more flexible way to fetch data: Graphql (Falcor)

// IF you need just 1-3 end points, use REST
// If you build something larger and you build it over time, use Graphql!

// GRaphql is the protocol between server and client
// SQL is the protocol between server and database

// Do NOT expose SQL to the client! You can do stupid things with it!
// e.g. sql injection: 105, DROP TABLE USERES would delete the whole database

// P.S. if you wanna hack something use tor!

import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';
require('dotenv').config();
const postgres = require('postgres');
const sql = postgres();

//// 1. Define Schema
const typeDefs = gql`
  type Query {
    # users: [User!]!
    # user(username: String): User
    todos(filterChecked: Boolean): [Todo]
    todo(id: String!): Todo
  }
  # type User {
  #   name: String
  #   username: String
  # }
  type Todo {
    id: String
    title: String
    checked: Boolean
  }
`;
//// 2. Define Data

// const users = [
//   { name: 'Leeroy Jenkins', username: 'leeroy' },
//   { name: 'Foo Bar', username: 'foobar' },
// ];

//// There are many ways to define functions!
//// Nik recommends the following style:
//// b:() => {console.log("yay")}

// const todos = [
//   { id: 'abc', title: 'Buy tomatoes', checked: true },
//   { id: 'def', title: 'Call mum', checked: false },
//   { id: 'ghi', title: 'Call dad', checked: false },
// ];

// 3. Define Resolvers

async function getTodos() {
  return await sql`select * from todos`;
}
const resolvers = {
  Query: {
    // users() {
    //   return users;
    // },
    // user(parent, { username }) {
    //   return users.find((user) => user.username === username);
    // },
    todos: async (root, args) => {
      if (args.filterChecked === true) {
        const todos = await getTodos();
        return todos.filter((todo) => todo.checked);
      } else if (args.filterChecked === false) {
        const todos = await getTodos();
        return todos.filter((todo) => !todo.checked);
      } else {
        return getTodos();
      }
    },

    // attention: args is positional, i.e. it has to be on position 2!
    todo: (root, args, context) => {
      return todos.find((todo) => todo.id === args.id);
    },
  },

  Todo: {
    title: (root) => {
      return root.title;
    },
    checked: (root) => {
      return root.checked;
    },
  },
};

// 4. Connnect data

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});

// Connect to a database using postgres psql
