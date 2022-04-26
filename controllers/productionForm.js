import { re } from "prettier";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/index.js";

export class productionFormController {
  static async submitForm(req, res) {
    try {
      const {
        cheesemakerId,
        assistantCheesemakerId,
        helperId,
        locationId,
        steps,
        dailyNote,
        status,
      } = req.body;

      if (req.body.id === undefined) {
        const id = uuidv4();

        const insertData = db.query(
          "insert into production (id, batch_number, production_datetime, cheesemaker_id, assistant_cheesemaker_id, helper_id, location_id, steps, daily_note, status, created_by, created_at) values (?,?,NOW(),?,?,?,?,?,?,?,?,NOW())",
          [
            id,
            "batchNumber123422",
            cheesemakerId,
            assistantCheesemakerId,
            helperId,
            locationId,
            JSON.stringify(steps),
            dailyNote,
            status,
            cheesemakerId,
          ],
          (err, row) => {
            if (row) {
              const insertedData = db.query(
                "select * from production where id = ?",
                [id],
                (err, row) => {
                  row[0].steps = JSON.parse(row[0].steps);
                  if (row) {
                    console.log("success insert production form");
                    res.json({
                      statusCode: 201,
                      message: "success insert production form",
                      data: row[0],
                    });
                  }
                }
              );
            } else {
              console.log(err);
              res.json({
                message: error,
              });
            }
          }
        );
      } else {
        const updateData = db.query(
          "update production set steps = ? where id = ?",
          [JSON.stringify(steps), req.body.id],
          (err, row) => {
            if (row) {
              const getUpdatedData = db.query(
                "select * from production where id = ?",
                [req.body.id],
                (err, row) => {
                  if (row) {
                    row[0].steps = JSON.parse(row[0].steps);
                    console.log("201 success update data");
                    res.json({
                      statusCode: 201,
                      message: "success update data",
                      data: row[0],
                    });
                  } else {
                    console.log(err);
                    re.json({
                      message: err,
                    });
                  }
                }
              );
            } else {
              console.log(err);
              re.json({
                message: err,
              });
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
      res.json({
        message: error,
      });
    }
  }

  static async getProductions(req, res) {
    try {
      const getData = db.query("select * from production", (err, rows) => {
        if (rows) {
          for (let i = 0; i < rows.length; i++) {
            rows[i].steps = JSON.parse(rows[i].steps);
          }
          res.json({
            statusCode: 200,
            message: "success retrieve data",
            dataCount: rows.length,
            data: rows,
          });
        } else {
          console.log(err);
          res.json({
            message: err,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: error,
      });
    }
  }

  static async getProductionById(req, res) {
    try {
      const { id } = req.params;
      const getData = db.query(
        "select * from production where id = ?",
        [id],
        (err, row) => {
          if (row) {
            row[0].steps = JSON.parse(row[0].steps);

            console.log("200 success retrieve data");
            res.json({
              statusCode: 200,
              message: "success retrieve data",
              data: row[0],
            });
          } else {
            console.log(err);
            res.json({
              message: err,
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

  static async reviseProduction(req, res) {
    try {
      const { id } = req.params;
      const { steps, revReason } = req.body;

      steps[steps.length - 1].status = "Waiting approval for revision";
      steps[steps.length - 1].revReason = revReason;

      const updateData = db.query(
        "update production set steps = ? where id = ?",
        [JSON.stringify(steps), id],
        (err, row) => {
          if (row) {
            // bikin function untuk notif ke supervisor

            console.log("201 revision request sent to spv");
            res.json({
              statusCode: 201,
              message: "revision request sent to spv",
            });
          } else {
            console.log(err);
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
}

export default { productionFormController };
