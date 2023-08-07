const dbConfig = require("../config/dbConn");
const { logEvents } = require("../middleware/logger");
const Sequelize = require("sequelize");

function connectToDatabase() {
  const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      operatorsAliases: false,
      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
    }
  );

  const db = {};

  // Assign the Sequelize and sequelize instances to the db object
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  // Define the associations correctly
  db.User = require("./User.js")(sequelize, Sequelize);
  db.Order = require("./Order.js")(sequelize, Sequelize);

  // Define associations between the models
  // Users have many Orders (one-to-many relationship)
  db.User.hasMany(db.Order, { as: "orders" });

  // Orders belong to a User (one-to-one relationship)
  db.Order.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
  });

  return db;
}

// Function to create the database if it doesn't exist
async function createDatabaseIfOrderExists() {
  try {
    const sequelize = new Sequelize("", dbConfig.USER, dbConfig.PASSWORD, {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      operatorsAliases: false,
    });

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);
    console.log("Database created or already exists.");
  } catch (error) {
    console.error("Error creating database:", error);
  }
}

// Call the function to create the database
createDatabaseIfOrderExists();

// Authenticate and synchronize the models with the database
(async () => {
  try {
    const db = connectToDatabase();

    await db.sequelize.authenticate();
    console.log("Connected to the database.");

    // { force: true } to recreate tables (use with caution)
    await db.sequelize.sync();
    console.log("Model synchronized successfully.");
  } catch (error) {
    console.error("Error:", error);
    logEvents(
      `${error.name}: ${error.message}\t${error.original?.syscall}\t${error.original?.hostname}`,
      "mysqlErrLog.log"
    );
  }
})();

module.exports = connectToDatabase();

// const dbConfig = require("../config/dbConn");
// const { logEvents } = require("../middleware/logger");

// const Sequelize = require("sequelize");

// // Function to create the database if it doesn't exist
// async function createDatabaseIfOrderxists() {
//   try {
//     const sequelize = new Sequelize("", dbConfig.USER, dbConfig.PASSWORD, {
//       host: dbConfig.HOST,
//       dialect: dbConfig.dialect,
//       operatorsAliases: false,
//     });

//     await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);
//     console.log("Database created or already exists.");
//   } catch (error) {
//     console.error("Error creating database:", error);
//   }
// }

// // Call the function to create the database
// createDatabaseIfOrderxists();

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
// });

// const db = {};

// // Assign the Sequelize and sequelize instances to the db object
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Define the associations correctly
// db.User = require("./User.js")(sequelize, Sequelize);
// db.Order = require("./Order.js")(sequelize, Sequelize);

// // Define associations between the models
// // Users have many Orders (one-to-many relationship)
// db.User.hasMany(db.Order, { as: "orders" });
// // db.User.hasMany(db.Order);

// // Orders belong to a User (one-to-one relationship)
// // db.Order.belongsTo(db.User);
// db.Order.belongsTo(db.User, {
//   foreignKey: "userId",
//   as: "user",
// });

// // Authenticate and synchronize the models with the database
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to the database.");
//     //{ force: true }
//     await sequelize.sync({ force: true });
//     console.log("Model synchronized successfully.");
//   } catch (error) {
//     console.error("Error:", error);
//     logEvents(
//       `${error.name}: ${error.message}\t${error.original?.syscall}\t${error.original?.hostname}`,
//       "mysqlErrLog.log"
//     );
//   }
// })();

// module.exports = db;
