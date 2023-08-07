module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "node_mysql_sequelize_db",
    dialect: "mysql",
  
    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };