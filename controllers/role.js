import Role from "../models/role.js";

export class roleController {
  static async getRoles(req, res) {
    try {
      const resultGetRoles = await Role.find();

      if (resultGetRoles.length > 0) {
        const dataCount = await Role.find().count();
        console.log("200 success retrieve all roles.");
        res.json({
          statusCode: 200,
          message: "success retrieve all roles.",
          dataCount,
          data: resultGetRoles,
        });
      } else {
        console.log("200 no data, please add new role.");
        res.json({
          statusCode: 200,
          message: "no data, please add new role.",
        });
      }
    } catch (error) {
      console.log("500 " + error.message);
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  static async getRoleById(req, res) {
    try {
      const findRole = await Role.findById(req.params.id);

      if (findRole) {
        console.log("200 success retrieve role data.");
        res.json({
          statusCode: 200,
          message: "success retrieve role data.",
          data: findLocation,
        });
      } else {
        console.log("404 role not found.");
        res.json({
          statusCode: 404,
          message: "role not found.",
        });
      }
    } catch (error) {
      console.log("500 " + error.message);
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  static async addRole(req, res) {
    if (Object.keys(req.body).length === 0) {
      console.log("400 please insert role data.");
      return res.json({
        statusCode: 400,
        message: "please insert role data.",
      });
    }
    try {
      const dataRole = new Role(req.body);
      const findRoleName = await Role.find({
        roleName: req.body.roleName,
      });

      if (findRoleName.length > 0) {
        console.log("200 role name already exist.");
        res.json({
          statusCode: 200,
          message: "role name already exist.",
        });
      } else {
        const addNewRole = await dataRole.save();
        console.log("201 success add new role.");
        res.json({
          statusCode: 201,
          message: "success add new role.",
          data: addNewRole,
        });
      }
    } catch (error) {
      console.log("500 " + error.message);
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  static async updateRole(req, res) {
    if (Object.keys(req.body).length < 3) {
      // require 3 req.body = roleName, isActive, updatedBy
      console.log("400 missing required field(s).");
      res.json({
        statusCode: 400,
        message: "missing required fields(s).",
      });
    }

    try {
      const resultUpdateRole = await Role.updateOne(
        { _id: req.body.roleId },
        {
          $set: {
            roleName: req.body.roleName,
            isActive: req.body.isActive,
          },
        }
      );
      console.log("201 success update role data.");
      res.json({
        statusCode: 201,
        message: "success update role data.",
      });
    } catch (error) {
      console.log("500 " + error.message);
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}

export default { roleController };
