import { v4 as uuidv4 } from "uuid";
import { db } from "../config/index.js";

export class processFormController {
  static async addForm(req, res) {
    try {
      const { title, steps } = req.body;
      const checkExisting = db.query(
        "select * from form where title = ?",
        [title],
        (err, rows) => {
          if (rows.length == 0) {
            const insertForm = db.query(
              'insert into form (id, title, steps, created_by, created_at) values (?,?,?,"admin",NOW())',
              [uuidv4(), title, JSON.stringify(steps)],
              (err, row) => {
                if (row) {
                  console.log("201 success add new form");
                  res.json({
                    statusCode: 201,
                    message: "success add new form",
                  });
                } else {
                  console.log(`502 ${err}`);
                  res.json({
                    statusCode: 502,
                    message: err,
                  });
                }
              }
            );
          } else {
            console.log("409 title already exist");
            res.json({
              statusCode: 409,
              message: "title already exist",
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

  static async getForms(req, res) {
    try {
      db.query("select * from form", (err, rows) => {
        let dataForms = [];

        for (let i = 0; i < rows.length; i++) {
          let steps = JSON.parse(rows[i].steps);
          rows[i].steps = steps;
          dataForms.push(rows[i]);
        }

        console.log("200 success retrieve forms");
        res.json({
          statusCode: 200,
          message: "success retrieve forms",
          dataCount: rows.length,
          data: dataForms,
        });
      });
    } catch (error) {
      console.log(`500 ${error}`);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async getFormById(req, res) {
    try {
      const { id } = req.params;

      const getForm = db.query("select * from form where id = ?", [id], (err, row) => {
        if (row.length > 0) {
          let formData = row[0]

          formData.steps = JSON.parse(formData.steps)

          console.log("200 success retrieve form");
          res.json({
            statusCode: 200,
            message: "success retrieve form",
            data: formData,
          });
        } else {
          console.log("404 form id not found");
          res.json({
            statusCode: 404,
            message: "form id not found",
          });
        }
      });
    } catch (error) {
      console.log(`500 ${error}`);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }
}

export default { processFormController };
