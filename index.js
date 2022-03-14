//import express
import express from "express";
//import ./config
import {db, client} from './config/index.js'
// import routes
import routes from "./routes/index.js";
//import cors
import cors from "cors";
//import dotenv
import 'dotenv/config'
// construct express function
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// listening to port
const port = 3000
app.listen(port, () => console.log(`V Server is running at port ${port}`));
