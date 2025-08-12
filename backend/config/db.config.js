const mongoose = require('mongoose');
require('dotenv').config();

const createConnection = async () => {
  const dbUri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI 
      : process.env.MONGODB_URI_TEST;  


  mongoose.connection.on("error", (e) => {
    console.error("[Mongoose Error] ", e);
  });

  mongoose.connection.on("connected", () => {
    console.log("[Mongoose] Conexión con la base de datos inicializada");
  });

  mongoose.connection.on("disconnected", () =>{
    console.log("[Mongoose] Desconectado de la base de datos");
  });

  return mongoose.connect(dbUri);
}

module.exports = {
  createConnection
};