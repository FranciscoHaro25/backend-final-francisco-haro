const mongoose = require("mongoose");

// Configuración de conexión a MongoDB
class DatabaseConfig {
  constructor() {
    this.connection = null;
  }

  // Conectar a MongoDB
  async connect() {
    try {
      // URI de conexión desde variables de entorno
      const MONGODB_URI = process.env.MONGODB_URI;

      if (!MONGODB_URI) {
        throw new Error(
          "MONGODB_URI no está definida en las variables de entorno"
        );
      }

      // Opciones de conexión optimizadas para MongoDB Atlas
      const options = {
        maxPoolSize: 10, // Máximo 10 conexiones en el pool
        serverSelectionTimeoutMS: 30000, // Aumentado para MongoDB Atlas
        socketTimeoutMS: 45000, // Timeout para socket
        connectTimeoutMS: 30000, // Timeout para conectar aumentado
        heartbeatFrequencyMS: 10000, // Frecuencia de heartbeat
        retryWrites: true, // Reintenta escrituras
        w: "majority", // Write concern
        authSource: "admin", // Fuente de autenticación
        ssl: true, // SSL requerido para Atlas
        tlsAllowInvalidCertificates: false,
        dbName: process.env.DB_NAME || "proyecto_final", // Nombre específico de la DB
      };

      console.log("Conectando a MongoDB Atlas...");

      // Establecer conexión
      this.connection = await mongoose.connect(MONGODB_URI, options);

      console.log(
        `Conectado a MongoDB Atlas: ${this.connection.connection.name}`
      );
      console.log(`Cluster: ${this.connection.connection.host}`);
      console.log(
        `📊 Estado: ${
          this.connection.connection.readyState === 1 ? "Activo" : "Inactivo"
        }`
      );

      // Configurar eventos de la conexión
      this.setupConnectionEvents();

      return this.connection;
    } catch (error) {
      console.error("❌ Error al conectar con MongoDB Atlas:", error.message);
      if (error.name === "MongoServerSelectionError") {
        console.error(
          "💡 Verifica que tu IP esté en la whitelist de MongoDB Atlas"
        );
        console.error("💡 Verifica las credenciales de conexión");
      }
      process.exit(1); // Salir si no se puede conectar
    }
  }

  // Configurar eventos de la conexión
  setupConnectionEvents() {
    const connection = mongoose.connection;

    // Conexión establecida
    connection.on("connected", () => {
      console.log("🔗 Mongoose conectado a MongoDB Atlas");
    });

    // Error de conexión
    connection.on("error", (error) => {
      console.error("❌ Error de conexión MongoDB Atlas:", error.message);
    });

    // Conexión perdida
    connection.on("disconnected", () => {
      console.log("⚠️ Mongoose desconectado de MongoDB Atlas");
    });

    // Reconexión exitosa
    connection.on("reconnected", () => {
      console.log("Mongoose reconectado a MongoDB Atlas");
    });

    // Cerrar conexión cuando la aplicación termine
    process.on("SIGINT", async () => {
      try {
        await connection.close();
        console.log(
          "🔚 Conexión MongoDB Atlas cerrada por terminación de la aplicación"
        );
        process.exit(0);
      } catch (error) {
        console.error("❌ Error al cerrar conexión:", error.message);
        process.exit(1);
      }
    });

    // Manejar terminación inesperada
    process.on("SIGTERM", async () => {
      try {
        await connection.close();
        console.log("🔚 Conexión MongoDB Atlas cerrada por SIGTERM");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error al cerrar conexión:", error.message);
        process.exit(1);
      }
    });
  }

  // Desconectar de MongoDB
  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("🔚 Desconectado de MongoDB");
    } catch (error) {
      console.error("❌ Error al desconectar:", error);
    }
  }

  // Obtener estado de la conexión
  getConnectionState() {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      state: states[mongoose.connection.readyState],
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
    };
  }
}

// Exportar instancia única (singleton)
module.exports = new DatabaseConfig();
