// src/data-source.js
require("reflect-metadata");
const { DataSource } = require("typeorm");
const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",   // tu contenedor expone 3311 a localhost
  port: 3311,          // ¡ojo! no uses 3306 si estás yendo al contenedor
  username: "root",
  password: "root",
  database: "graphql_practica",
  synchronize: true,
  logging: false,
  entities: [Mesa, Padron],
});

module.exports = { AppDataSource };
