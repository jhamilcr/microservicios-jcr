// src/schema/resolvers.js
const { AppDataSource } = require("../data-source");

const resolvers = {
  Query: {
    getPadrones: async () => {
      // seguridad por si alguien invoca antes de tiempo
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      return AppDataSource.getRepository("Padron").find({
        relations: ["mesa"],
      });
    },
    getMesas: async () => {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      return AppDataSource.getRepository("Mesa").find({
        relations: ["padrones"],
      });
    },
    getPadronById: async (_, { id }) => {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      return AppDataSource.getRepository("Padron").findOne({
        where: { id: Number(id) },
        relations: ["mesa"],
      });
    },
  },
  Mutation: {
    createMesa: async (_, { nro_mesa, nombre_escuela }) => {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const repo = AppDataSource.getRepository("Mesa");
      const mesa = repo.create({ nro_mesa, nombre_escuela });
      return repo.save(mesa);
    },
    createPadron: async (
      _,
      { nombres, apellidos, numero_documento, fotografia, mesaId }
    ) => {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const repoPadron = AppDataSource.getRepository("Padron");
      const repoMesa = AppDataSource.getRepository("Mesa");

      const mesa = await repoMesa.findOneBy({ id: Number(mesaId) });
      if (!mesa) throw new Error("Mesa no encontrada");

      const padron = repoPadron.create({
        nombres,
        apellidos,
        numero_documento,
        fotografia,
        mesa,
      });
      return repoPadron.save(padron);
    },
  },
};

module.exports = resolvers;
