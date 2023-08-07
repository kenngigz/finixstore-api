const db = require("../models");

// create main Model
const User = db.User;
const Order = db.Order;
/*  */ // @desc Get all orders
// @route GET /orders
// @access Private
const getAllOrders = async (req, res) => {
  // Get all orders from MongoDB
  const orders = await Order.findAll();

  // If no orders
  if (!orders?.length) {
    return res.status(400).json({ message: "No orders found" });
  }
  // console.log("orders", orders);
  // Add username to each order before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const ordersWithUser = await Promise.all(
    orders.map(async (order) => {
      const user = await User.findByPk(order.userId);
      console.log("user", user);
      return { ...order.dataValues, username: user.username };
    })
  );

  res.json(ordersWithUser);
};

// @desc Create new order
// @route POST /orders
// @access Private
const createNewOrder = async (req, res) => {
  const { user, food, text, customerName, approvedby } = req.body;

  // Confirm data
  if (!user || !food || !text || !customerName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate food
  // const duplicate = await Order.findOne({
  //   where: { food: food },
  // });

  // if (duplicate) {
  //   return res.status(409).json({ message: "Duplicate order food" });
  // }

  const currentuser = await User.findOne({
    where: { id: user },
  });
  console.log("currentuser", currentuser);
  const userId = user;
  console.log("userid", userId);
  // Create and store the new order
  const orderObject =
    approvedby === ""
      ? { user, food, text, customerName, userId: userId }
      : { user, food, text, customerName, approvedby, userId: userId };

  const order = await Order.create(orderObject);

  // const order = await Order.create({ user, food, text, customerName });

  if (order) {
    // Created
    return res.status(201).json({ message: "New order created" });
  } else {
    return res.status(400).json({ message: "Invalid order data received" });
  }
};

// @desc Update a order
// @route PATCH /orders
// @access Private
const updateOrder = async (req, res) => {
  const { id, user, food, text, completed, approvedby } = req.body;

  // Confirm data
  if (!id || !user || !food || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm order exists to update
  const order = await Order.findByPk(id);

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  // // Check for duplicate food
  // const duplicate = await Order.findOne({ food });

  // // Allow renaming of the original order
  // if (duplicate && duplicate?.id.toString() !== id) {
  //   return res.status(409).json({ message: "Duplicate order food" });
  // }

  order.user = user;
  order.food = food;
  order.text = text;
  order.completed = completed;
  order.approvedby = approvedby;

  const updatedOrder = await order.save();

  res.json(`'${updatedOrder.food}' updated`);
};

// @desc Delete a order
// @route DELETE /orders
// @access Private
const deleteOrder = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Order ID required" });
  }

  // Confirm order exists to delete
  const order = await Order.findByPk(id);

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  const result = await order.destroy();

  const reply = `Order '${result.food}' with ID ${result.id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllOrders,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
