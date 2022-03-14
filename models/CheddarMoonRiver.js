// import mongoose
import mongoose from "mongoose";

// Buat Schema
const CheddarMoonRiver = mongoose.Schema({
  batchNumber: String,
  cheeseMaker: String,
  assistanCheeseMaker: String,
  location: String,
  productionDatetime: String,

  lab: {
    fat: String,
    solidNonFat: String,
    protein: String,
    totalSolid: String,
  },

  cheddaring: {
    type: Object,
    startingTime: {
      startingTime: String,
      temperature: String,
      curdpH: String,
    },
    stacking: [
      {
        stackingTime: String,
        temperature: String,
        curdpH: String,
      },
    ],
    // stacking: {
    //   type: Array,
    //   "default": []
    // },
    endTime: {
      endTime: String,
      temperature: String,
      curdpH: String,
    },
  },

  status: {
    type: String,
    default: "Draft",
  },
});

// export model
export default mongoose.model("CheddarMoonRivers", CheddarMoonRiver);
