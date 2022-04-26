import { db } from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

export class userController {
  static async addUser(req, res) {
    try {
      const { name, phone, username, roleId } = req.body;

      const checkExisting = db.query(
        "select * from user where phone = ?",
        [phone],
        (err, rows) => {
          if (rows.length == 0) {
            const insertUser = db.query(
              'insert into user (id, name, phone, username, role_id, password, created_by, created_at) value (?,?,?,?,?,?,"admin",NOW())',
              [
                uuidv4(),
                name,
                phone,
                username,
                roleId,
                "$2b$10$obZJBHPNIED3zbNcHv4D0eK53jROxk8PhPRK5jJsxcxkyhd683cBe",
              ],
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

  static async getUserById(req, res) {
    try {
      const id = req.params.id;

      db.query(
        "select role.name as role_name, user.* from user inner join role on user.role_id = role.id where user.id = ?",
        [id],
        (err, row) => {
          if (row) {
            const {
              password,
              access_token,
              created_by,
              created_at,
              updated_by,
              updated_at,
              ...data
            } = row[0];
            console.log("200 success retrieve user data");

            res.json({
              statusCode: 200,
              message: "success retrieve user data",
              data,
            });
          } else {
            console.log(`503 error while get query => ${err}`);

            res.json({
              statusCode: 503,
              message: "error while get query",
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

  static async getUsers(req, res) {
    try {
      db.query("select * from user", (err, rows) => {
        if (rows) {
          let data = [];

          for (let i = 0; i < rows.length; i++) {
            delete rows[i].password;
            delete rows[i].access_token;
            delete rows[i].created_by;
            delete rows[i].created_at;
            delete rows[i].updated_by;
            delete rows[i].updated_at;

            data.push(rows[i]);
          }
          console.log("200 success retrieve users");

          res.json({
            statusCode: 200,
            message: "success retrieve users",
            dataCount: data.length,
            data,
          });
        } else {
          console.log("503 error while query get users");

          res.json({
            statusCode: 503,
            message: "error while query get users",
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

  static async updateUser(req, res) {
    try {
      const { id, name, phone, username, isActive } = req.body;

      const checkExisting = db.query(
        "select * from user where (phone = ? or username = ?) and not (phone = ? and username = ?)",
        [phone, username, phone, username],
        (err, row) => {
          if (row.length > 0) {
            console.log("409 phone or username already exist");

            res.json({
              statusCode: 409,
              message: "phone or username already exist",
            });
          } else {
            db.query(
              "update user set name = ?, phone = ?, username = ?, is_active = ? where id = ?",
              [name, phone, username, isActive, id],
              (err, row) => {
                if (row) {
                  console.log("201 success update user data");

                  res.json({
                    statusCode: 201,
                    message: "success update user data",
                  });
                } else {
                  console.log("502 error while update user data query");

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
    } catch (error) {
      console.log("500 " + error);

      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }
}

export default { userController };
