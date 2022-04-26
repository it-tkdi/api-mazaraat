import Location from "../models/location.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/index.js";

export class locationController {
  static async addLocation(req, res) {
    if (Object.keys(req.body).length === 0) {
      console.log("400 please insert location data.");
      return res.json({
        statusCode: 400,
        message: "please insert location data.",
      });
    }

    try {
      const { name, address } = req.body;
      const checkExisting = db.query(
        "select * from location where name = ?",
        [name],
        (err, rows) => {
          if (rows.length == 0) {
            const insertData = db.query(
              "insert into location (id, name, address, created_by, created_at) values (?,?,?,?,NOW())",
              [uuidv4(), name, address, "admin"],
              (err, row) => {
                if (row) {
                  console.log("201 success add new location");
                  res.json({
                    statusCode: 201,
                    message: "success add new location",
                  });
                } else {
                  console.log("502 query error while insert data");
                  res.json({
                    statusCode: 502,
                    message: "query error while insert data",
                  });
                }
              }
            );
          } else {
            console.log("409 location name already exist");
            res.json({
              statusCode: 409,
              message: "location name already exist",
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async getLocations(req, res) {
    try {
      db.query("select * from location", (err, rows) => {
        if (rows) {
          console.log("200 success retrieve all locations");

          res.json({
            statusCode: 200,
            message: "success retrieve all locations",
            dataCount: rows.length,
            data: rows,
          });
        } else {
          console.log(err);
          res.json({
            statusCode: 502,
            message: err,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async getLocationById(req, res) {
    try {
      const id = req.params.id;

      db.query("select * from location where id = ?", [id], (err, row) => {
        if (row) {
          console.log("200 success retrieve location");

          res.json({
            statusCode: 200,
            message: "success retrieve location",
            data: row[0],
          });
        } else {
          console.log("502 error while get data query");

          res.json({
            statusCode: 502,
            message: err,
          });
        }
      });
    } catch (error) {
      console.log("500" + error);

      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  static async updateLocation(req, res) {
    try {
      const { id, name, address, isActive } = req.body;

      const checkExisting = db.query(
        "select * from location where name = ?",
        [name],
        (err, rows) => {
          if (rows.length > 0) {
            console.log("409 location name already exist");

            res.json({
              statusCode: 409,
              message: "location name already exist",
            });
          } else {
            db.query(
              "update location set name = ?, address = ?, is_active = ? where id = ?",
              [name, address, isActive, id],
              (err, row) => {
                if (row) {
                  console.log("201 success update location data");

                  res.json({
                    statusCode: 201,
                    message: "success update location data",
                  });
                } else {
                  console.log("502 error while update data query");

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
      console.log("500" + error);

      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }

  // static async getLocations(req, res) {
  //   try {
  //     const resultGetLocations = await Location.find();

  //     if (resultGetLocations.length > 0) {
  //       const dataCount = await Location.find().count();
  //       console.log("200 success retrieve all locations.");
  //       res.json({
  //         statusCode: 200,
  //         message: "success retrieve all locations.",
  //         dataCount,
  //         data: resultGetLocations,
  //       });
  //     } else {
  //       console.log("200 no data, please add new location.");
  //       res.json({
  //         statusCode: 200,
  //         message: "no data, please add new location.",
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

  // static async getLocationById(req, res) {
  //   try {
  //     const findLocation = await Location.findById(req.params.id);

  //     if (findLocation) {
  //       console.log("200 success retrieve location data.");
  //       res.json({
  //         statusCode: 200,
  //         message: "success retrieve location data.",
  //         data: findLocation,
  //       });
  //     } else {
  //       console.log("404 location not found.");
  //       res.json({
  //         statusCode: 404,
  //         message: "location not found.",
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

  // static async addLocation(req, res) {
  //   if (Object.keys(req.body).length === 0) {
  //     console.log("400 please insert location data.");
  //     return res.json({
  //       statusCode: 400,
  //       message: "please insert location data.",
  //     });
  //   }
  //   try {
  //     const dataLocation = new Location(req.body);
  //     const findLocationName = await Location.find({
  //       locationName: req.body.locationName,
  //     });

  //     if (findLocationName.length > 0) {
  //       console.log("200 location name already exist.");
  //       res.json({
  //         statusCode: 200,
  //         message: "location name already exist.",
  //       });
  //     } else {
  //       const addNewLocation = await dataLocation.save();
  //       console.log("201 success add new location.");
  //       res.json({
  //         statusCode: 201,
  //         message: "success add new location.",
  //         data: addNewLocation,
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

  // static async updateLocation(req, res) {
  //   if (Object.keys(req.body).length < 4) {
  //     // require 4 req.body = locationName, address, isActive, updatedBy
  //     console.log("400 missing required field(s).");
  //     res.json({
  //       statusCode: 400,
  //       message: "missing required fields(s).",
  //     });
  //   }

  //   try {
  //     const resultUpdateLocation = await Location.updateOne(
  //       { _id: req.body.locationId },
  //       {
  //         $set: {
  //           locationName: req.body.locationName,
  //           isActive: req.body.isActive,
  //         },
  //       }
  //     );
  //     console.log("201 success update location data.");
  //     res.json({
  //       statusCode: 201,
  //       message: "success update location data.",
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

export default { locationController };
