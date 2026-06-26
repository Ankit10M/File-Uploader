const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const upload = require("../config/multer.config");
const File = require("../models/file.model");
const authMiddle = require('../middleware/authe');

router.get("/home", authMiddle, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    res.render("home", { files, user: req.user });
  } catch (error) {
    console.error("Home load error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/upload", authMiddle, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const savedFile = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      userId: req.user.userId,
    });

    res.status(200).json({
      message: "File uploaded successfully",
      fileId: savedFile._id,
      filename: savedFile.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/download/:id", authMiddle, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send("File not found.");
    }
    if (file.userId.toString() !== req.user.userId) {
      return res.status(403).send("Forbidden");
    }

    return res.download(path.resolve(file.path), file.originalname);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/file/:id", authMiddle, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }
    if (file.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await File.deleteOne({ _id: file._id });
    res.json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
