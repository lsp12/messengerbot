import mongoose from "mongoose";

mongoose
  .connect("mongodb://mongo/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("database is conected", db.connection.host))
  .catch((err) => console.error(err));
