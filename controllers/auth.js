import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from '../config/index.js'

export class authController {
  static async login(req, res) {
    if (Object.keys(req.body).length == 0) {
      console.log("400 missing required field(s).");
      res.json({
        statusCode: 400,
        message: "400 missing required field(s).",
      });
    }
    try {
      const { username, password } = req.body;
      // const findUser = await User.find({
      //   username: username
      // });
      const findUser = await User.aggregate([{
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "roleName"
        }
      }, {
        $unwind: "$roleName"
      }, {
        $match: {
          username: username
        }
      }
    ]);

      if (findUser.length > 0) {
        const comparedPassword = await bcrypt.compare(
          password,
          findUser[0].password
        );
        if (comparedPassword) {
          const roleName = findUser[0].roleName.roleName
          findUser[0].roleName = roleName

          const token = jwt.sign(
            findUser[0],
            process.env.TOKEN_SECRET,
            {
              expiresIn: "2h",
            }
          );

          findUser[0].access_token = token;
          
          const updateToken = await User.updateOne(
            { _id: findUser[0]._id },
            {
              $set: { access_token: token },
            }
            );
            
          const userData = JSON.parse(JSON.stringify(findUser[0]))
          const {password, createdBy, createdAt, __v, access_token, ...cleanData} = userData

          await client.setEx(`profileCache_${cleanData._id}`, 120, JSON.stringify(cleanData))

          const cachedProfile = await client.get(`profileCache_${cleanData._id}`)

          console.log("200 success login.");
          res.json({
            statusCode: 200,
            message: "success login.",
            userInfo: cleanData,
            cachedData: JSON.parse(cachedProfile)
          });
        } else {
          console.log("403 incorrect password.");
          res.json({
            statusCode: 403,
            message: "incorrect password",
          });
        }
      } else {
        console.log("403 data not found.");
        res.json({
          statusCode: 403,
          message: "data not found.",
        });
      }
    } catch (error) {
      console.log(`503 ${error}`);
      res.json({
        statusCode: 503,
        message: error,
      });
    }
  }

  static async register(req, res) {
    if (Object.keys(req.body).length == 0) {
      console.log("400 missing required field(s).");
      res.json({
        statusCode: 400,
        message: "400 missing required field(s).",
      });
    }

    try {
      const { name, username, password, roleId } = req.body;
      const userData = new User(req.body);

      const hashPassword = await bcrypt.hash(password, 10);
      userData.password = hashPassword;

      const checkUser = await User.find({
        username: username,
      });

      if (checkUser.length > 0) {
        console.log("username already exist.");
        res.json({
          message: "username already exist.",
        });
      } else {
        const insertUserData = await userData.save();
        console.log("proceed create data.");
        res.json({
          message: "proceed create data.",
          data: insertUserData,
        });
      }
    } catch (error) {
      console.log(`503 ${error}`);
      res.json({
        statusCode: 503,
        message: error,
      });
    }
  }
}

export default { authController };
