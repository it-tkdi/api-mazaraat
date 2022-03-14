import mongoose from "mongoose";

// connect ke database mongoDB
const port = 27017
mongoose.connect(
    `mongodb://userAdmin:password@localhost:${port}/db-mazaraat?retryWrites=true&w=majority&authSource=admin`
  );
  // mongoose.connect(
  //   "mongodb+srv://ferdinand:hutomo29@cluster0.9etop.mongodb.net/restful_db?retryWrites=true&w=majority",
  //   {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   }
  // );
  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log(`V MongoDB is up and running at port ${port}`));

  export default db