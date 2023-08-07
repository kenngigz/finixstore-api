const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.JSON, // JSON data type to emulate an array-like behavior
      defaultValue: ["Employee"], // Default value for the roles array (as a JSON array)
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return User;
};
