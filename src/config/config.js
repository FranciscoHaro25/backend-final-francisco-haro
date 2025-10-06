/**
 * Configuración centralizada de la aplicación
 * Maneja variables de entorno y valores por defecto
 */

require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = config;
