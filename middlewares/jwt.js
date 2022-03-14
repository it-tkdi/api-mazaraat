// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.json({
      statusCode: 401,
      message: "token is null.",
    });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res.json({
        statusCode: 403,
        message: "invalid token.",
      });

    req.user = user;

    next();
  });
};