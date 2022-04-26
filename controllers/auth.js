import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../config/index.js";
import { db } from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

export class authController {
  static async register(req, res) {
    try {
      const { name, phone, username, password, roleId } = req.body;

      const checkExisting = db.query(
        "select * from user where phone = ? or username = ?",
        [phone, username],
        async (err, rows) => {
          if (rows.length == 0) {
            const hashPassword = await bcrypt.hash(password, 10);

            const insertUser = db.query(
              'insert into user (id, name, phone, username, role_id, password, created_by, created_at) values (?,?,?,?,?,?,"admin",NOW())',
              [uuidv4(), name, phone, username, roleId, hashPassword],
              async (err, row) => {
                if (row) {
                  console.log("201 success register new user");

                  res.json({
                    statusCode: 201,
                    message: "success register new user",
                  });
                } else {
                  console.log(err);
                  res.json({
                    message: err,
                  });
                }
              }
            );
          } else {
            console.log("409 phone / username already exist");
            res.json({
              statusCode: 409,
              message: "phone / username already exist",
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.json({
        message: error,
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const checkUser = db.query(
        "select * from user where username = ? or phone = ?",
        [username, username],
        async (err, rows) => {
          if (rows.length > 0) {
            if(rows[0].is_active == 0) {
              console.log('403 account is not activated yet');
              return res.json({
                statusCode: 403,
                message: 'account is not activated yet'
              })
            }

            const comparedPassword = await bcrypt.compare(
              password,
              rows[0].password
            );

            if (comparedPassword) {
              const {
                password,
                access_token,
                created_by,
                created_at,
                updated_by,
                updated_at,
                ...userData
              } = rows[0];

              const accessToken = await jwt.sign(
                userData,
                process.env.TOKEN_SECRET,
                { expiresIn: "2h" }
              );

              userData.access_token = accessToken;

              db.query(
                "update user set access_token = ? where id = ?",
                [accessToken, userData.id],
                (err, row) => {
                  if (row) {
                    console.log("200 success login");
                    res.json({
                      statusCode: 200,
                      message: "success login",
                      data: userData,
                    });
                  }
                }
              );
            } else {
              console.log("401 incorrect password");
              res.json({
                statusCode: 401,
                message: "incorrect password",
              });
            }
          } else {
            console.log("404 phone / username not found");
            res.json({
              statusCode: 404,
              message: "phone / username not found",
            });
          }
        }
      );
    } catch (error) {
      console.log(`500 ${error}`);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }
  // static async login(req, res) {
  //   if (Object.keys(req.body).length == 0) {
  //     console.log("400 missing required field(s).");
  //     res.json({
  //       statusCode: 400,
  //       message: "400 missing required field(s).",
  //     });
  //   }
  //   try {
  //     const { username, password } = req.body;
  //     // const findUser = await User.find({
  //     //   username: username
  //     // });
  //     const findUser = await User.aggregate([{
  //       $lookup: {
  //         from: "roles",
  //         localField: "roleId",
  //         foreignField: "_id",
  //         as: "roleName"
  //       }
  //     }, {
  //       $unwind: "$roleName"
  //     }, {
  //       $match: {
  //         username: username
  //       }
  //     }
  //   ]);

  //     if (findUser.length > 0) {
  //       const comparedPassword = await bcrypt.compare(
  //         password,
  //         findUser[0].password
  //       );
  //       if (comparedPassword) {
  //         const roleName = findUser[0].roleName.roleName
  //         findUser[0].roleName = roleName

  //         const token = jwt.sign(
  //           findUser[0],
  //           process.env.TOKEN_SECRET,
  //           {
  //             expiresIn: "2h",
  //           }
  //         );

  //         findUser[0].access_token = token;

  //         const updateToken = await User.updateOne(
  //           { _id: findUser[0]._id },
  //           {
  //             $set: { access_token: token },
  //           }
  //           );

  //         const userData = JSON.parse(JSON.stringify(findUser[0]))
  //         const {password, createdBy, createdAt, __v, access_token, ...cleanData} = userData

  //         await client.setEx(`profileCache_${cleanData._id}`, 120, JSON.stringify(cleanData))

  //         const cachedProfile = await client.get(`profileCache_${cleanData._id}`)

  //         console.log("200 success login.");
  //         res.json({
  //           statusCode: 200,
  //           message: "success login.",
  //           userInfo: {...cleanData, token: userData.access_token},
  //           cachedData: JSON.parse(cachedProfile)
  //         });
  //       } else {
  //         console.log("403 incorrect password.");
  //         res.json({
  //           statusCode: 403,
  //           message: "incorrect password",
  //         });
  //       }
  //     } else {
  //       console.log("403 data not found.");
  //       res.json({
  //         statusCode: 403,
  //         message: "data not found.",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(`503 ${error}`);
  //     res.json({
  //       statusCode: 503,
  //       message: error,
  //     });
  //   }
  // }

  // static async register(req, res) {
  //   if (Object.keys(req.body).length == 0) {
  //     console.log("400 missing required field(s).");
  //     res.json({
  //       statusCode: 400,
  //       message: "400 missing required field(s).",
  //     });
  //   }

  //   try {
  //     const { name, username, password, roleId } = req.body;
  //     const userData = new User(req.body);

  //     const hashPassword = await bcrypt.hash(password, 10);
  //     userData.password = hashPassword;

  //     const checkUser = await User.find({
  //       username: username,
  //     });

  //     if (checkUser.length > 0) {
  //       console.log("username already exist.");
  //       res.json({
  //         message: "username already exist.",
  //       });
  //     } else {
  //       const insertUserData = await userData.save();
  //       console.log("proceed create data.");
  //       res.json({
  //         message: "proceed create data.",
  //         data: insertUserData,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(`503 ${error}`);
  //     res.json({
  //       statusCode: 503,
  //       message: error,
  //     });
  //   }
  // }
}

export default { authController };
