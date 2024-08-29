/**
 * Módulo para controlar gestionar conexiones con una base de datos MongoDB
 * utilizando el ODM Mongoose.
 *
 * @module db
 */

const mongoose = require("mongoose");
/**
 * Establece una conexión por defecto con una base de datos MongoDB.
 *
 * @returns {Promise} Posible resultado de la conexión por defecto con
 *                    la base de datos.
 */
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env;

const createConnection = async () => {
  const actualURL = NODE_ENV === "test" ? MONGODB_URI_TEST : MONGODB_URI;
  mongoose.connection.on("error", (error) => {
    console.error(`[Mongoose] ${error}`);
  });

  mongoose.connection.on("connected", (error) => {
    console.log(
      `[Mongoose] Conexión establecida con la base de datos ${mongoose.connection.name}`
    );
  });

  mongoose.connection.on("disconnected", (error) => {
    console.log(`[Mongoose] Desconexión con la base de datos`);
  });

  return mongoose.connect(actualURL);
};

module.exports = { createConnection };
