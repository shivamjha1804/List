const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectToDb = require("./db/db");
const listRoutes = require("./routes/list.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

connectToDb();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/upload", upload.single("profilePic"), (req, res) => {
  try {
    console.log(req.file);
    res.status(200).json({
      status: true,
      message: "File uploaded successfully!",
      file: req.file,
    });
  } catch (error) {
    res.status(400).json({ state: false, error: error.message });
  }
});

app.use("/user", userRoutes);
app.use("/list", listRoutes);

module.exports = app;
