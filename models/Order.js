//10. [ ] Orders are assigned to specific employees
//11. [ ] Orders have a ticket #, title, order body, created & updated dates
//12. [ ] Orders are either OPEN or COMPLETED
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      food: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      approvedby: {
        type: DataTypes.STRING,
        allowNull: true, // JSON data type to emulate an array-like behavior
        defaultValue: "N/A", // Default value for the roles array (as a JSON array)
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      // autoIncrement: true,
      // // Options for autoIncrement
      // autoIncrement: {
      //   // The initial value for the primary key. Default is 1.
      //   initialValue: 1,
      // },
    }
  );

  return Order;
};
