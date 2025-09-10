// src/index.js
require("reflect-metadata");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const { AppDataSource } = require("./data-source");

async function startServer() {
  // Inicializa la BD ANTES de aceptar requests
  await AppDataSource.initialize();
  console.log("✅ Conectado a la base de datos");

  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ AppDataSource }) // (opcional, por claridad)
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(4000, () => {
    console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
  });
}
startServer();
