// import mongoose
import mongoose from "mongoose";

// Buat Schema
const Location = mongoose.Schema({
  locationName: {
    type: String,
  },

  address: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: 1,
  },

  createdBy: {
    type: String,
    default: "Admin",
  },

  createdAt: {
    type: String,
    default: "2022-02-02 20:12:45",
  },

  updatedBy: {
    type: String,
  },

  updatedAt: {
    type: String,
  },
});

// export model
export default mongoose.model("Locations", Location);
