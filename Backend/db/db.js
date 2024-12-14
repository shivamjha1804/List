const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(
      "mongodb+srv://shivamjha:khxZuTmbC15Pa2ae@cluster0.zhtrk.mongodb.net/dev"
    )
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.log("Error while connecting DB:", error);
    });
}

module.exports = connectToDb;
