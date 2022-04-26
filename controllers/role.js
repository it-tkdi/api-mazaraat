import Role from "../models/role.js";
import { db } from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

export class roleController {
  static async addRole(req, res) {
    try {
      const { name } = req.body;

      const checkExisting = db.query(
        "select * from role where name = ?",
        [name],
        (err, rows) => {
          if (rows.length == 0) {
            const insertRole = db.query(
              'insert into role (id, name, created_by, created_at) value (?,?,"admin",NOW())',
              [uuidv4(), name],
              (err, row) => {
                if (row) {
                  console.log("201 success add role");

                  res.json({
                    statusCode: 201,
                    message: "success add role",
                  });
                } else {
                  console.log("503 " + err);

                  res.json({
                    statusCode: 503,
                    message: err,
                  });
                }
              }
            );
          } else {
            console.log("503 role name already exist");

            res.json({
              statusCode: 503,
              message: "role name already exist",
            });
          }
        }
      );
    } catch (error) {
      console.log("500 " + error);

      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async getRoleById(req, res) {
    try {
      const id = req.params.id;

      db.query("select * from role where id = ?", [id], (err, row) => {
        if (row) {
          console.log("200 success retrieve role data");

          res.json({
            statusCode: 200,
            message: "success retrieve role data",
            data: row[0],
          });
        } else {
          console.log("503 error while get query");

          res.json({
            statusCode: 503,
            message: "error while get query",
          });
        }
      });
    } catch (error) {
      console.log("500 " + error);

      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async getRoles(req, res) {
    try {
      db.query("select * from role", (err, rows) => {
        if (rows) {
          console.log("200 success retrieve roles");

          res.json({
            statusCode: 200,
            message: "success retrieve roles",
            dataCount: rows.length,
            data: rows,
          });
        } else {
          console.log("503 error while query get roles");

          res.json({
            statusCode: 503,
            message: "error while query get roles",
          });
        }
      });
    } catch (error) {
      console.log("500 " + error);

      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async updateRole(req, res) {
    try {
      const { id, name, isActive } = req.body;

      const checkExisting = db.query(
        "select * from role where name = ?",
        [name],
        (err, row) => {
          if (row.length > 0) {
            console.log("409 role name already exist");

            res.json({
              statusCode: 409,
              message: "role name already exist",
            });
          } else {
            db.query(
              "update role set name = ?, is_active = ? where id = ?",
              [name, isActive, id],
              (err, row) => {
                if (row) {
                  console.log("201 success update role data");

                  res.json({
                    statusCode: 201,
                    message: "success update role data",
                  });
                } else {
                  console.log("502 error while update role data query");

                  res.json({
                    statusCode: 502,
                    message: err,
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {}
  }

  // static async getRoles(req, res) {
  //   try {
  //     const resultGetRoles = await Role.find();

  //     if (resultGetRoles.length > 0) {
  //       const dataCount = await Role.find().count();
  //       console.log("200 success retrieve all roles.");
  //       res.json({
  //         statusCode: 200,
  //         message: "success retrieve all roles.",
  //         dataCount,
  //         data: resultGetRoles,
  //       });
  //     } else {
  //       console.log("200 no data, please add new role.");
  //       res.json({
  //         statusCode: 200,
  //         message: "no data, please add new role.",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("500 " + error.message);
  //     res.json({
  //       statusCode: 500,
  //       message: error.message,
  //     });
  //   }
  // }

  // static async getRoleById(req, res) {
  //   try {
  //     const findRole = await Role.findById(req.params.id);

  //     if (findRole) {
  //       console.log("200 success retrieve role data.");
  //       res.json({
  //         statusCode: 200,
  //         message: "success retrieve role data.",
  //         data: findLocation,
  //       });
  //     } else {
  //       console.log("404 role not found.");
  //       res.json({
  //         statusCode: 404,
  //         message: "role not found.",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("500 " + error.message);
  //     res.json({
  //       statusCode: 500,
  //       message: error.message,
  //     });
  //   }
  // }

  // static async addRole(req, res) {
  //   if (Object.keys(req.body).length === 0) {
  //     console.log("400 please insert role data.");
  //     return res.json({
  //       statusCode: 400,
  //       message: "please insert role data.",
  //     });
  //   }
  //   try {
  //     const dataRole = new Role(req.body);
  //     const findRoleName = await Role.find({
  //       roleName: req.body.roleName,
  //     });

  //     if (findRoleName.length > 0) {
  //       console.log("200 role name already exist.");
  //       res.json({
  //         statusCode: 200,
  //         message: "role name already exist.",
  //       });
  //     } else {
  //       const addNewRole = await dataRole.save();
  //       console.log("201 success add new role.");
  //       res.json({
  //         statusCode: 201,
  //         message: "success add new role.",
  //         data: addNewRole,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("500 " + error.message);
  //     res.json({
  //       statusCode: 500,
  //       message: error.message,
  //     });
  //   }
  // }

  // static async updateRole(req, res) {
  //   if (Object.keys(req.body).length < 3) {
  //     // require 3 req.body = roleName, isActive, updatedBy
  //     console.log("400 missing required field(s).");
  //     res.json({
  //       statusCode: 400,
  //       message: "missing required fields(s).",
  //     });
  //   }

  //   try {
  //     const resultUpdateRole = await Role.updateOne(
  //       { _id: req.body.roleId },
  //       {
  //         $set: {
  //           roleName: req.body.roleName,
  //           isActive: req.body.isActive,
  //         },
  //       }
  //     );
  //     console.log("201 success update role data.");
  //     res.json({
  //       statusCode: 201,
  //       message: "success update role data.",
  //     });
  //   } catch (error) {
  //     console.log("500 " + error.message);
  //     res.json({
  //       statusCode: 500,
  //       message: error.message,
  //     });
  //   }
  // }
}

export default { roleController };
