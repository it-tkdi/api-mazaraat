import CheddarMoonRiver from "../models/CheddarMoonRiver.js";

export class cheeseRecordFormController {
  static async submitCheddarMoonRiver(req, res) {
    const dataCheddarMoonRiver = new CheddarMoonRiver(req.body);
    try {
      const findBatchNumber = await CheddarMoonRiver.findOne({
        batchNumber: dataCheddarMoonRiver.batchNumber,
      });
      if (findBatchNumber) {
        // overwrite the collection
        const updatedataCheddarMoonRiver = req.body;
        const updateRecord = await CheddarMoonRiver.updateOne(
          { batchNumber: dataCheddarMoonRiver.batchNumber },
          { $set: updatedataCheddarMoonRiver }
        );
        const dataCount = await CheddarMoonRiver.find().count();
        console.log(`dataCount = ${dataCount}`);
        console.log("201 success update data.");
        res.json({
          statusCode: 201,
          message: "success update data.",
          data: dataCheddarMoonRiver,
        });
      } else {
        const savedRecord = await dataCheddarMoonRiver.save();
        const dataCount = await CheddarMoonRiver.find().count();
        console.log("dataCount = " + dataCount);
        console.log(savedRecord);
        res.json({
          statusCode: 201,
          message: "success submit data.",
          data: savedRecord,
        });
      }
    } catch (error) {
      console.log(error.message);
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  static async submitAthanMazaraat(req, res) {
    console.log("AthanMazaraat");
  }
}

export default { cheeseRecordFormController };
