// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");
// const app = express();
// const PORT = 5000;

// // // const DATA_FILE = path.join(__dirname, "data.json");
// const data = require("./data");

// // // // Enable CORS
// app.use(cors());

// // // // Serve static images from /uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // // // API endpoint
// app.get("/api/data", (req, res) => {
//   res.json(data);
// });

// const multer = require("multer");
// // Ensure the "uploads" folder exists
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir); // Create the "uploads" folder if it doesn't exist
// }

// // Set up multer storage for images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir); // Store files in the "uploads" folder
//   },
//   filename: (req, file, cb) => {
//     // Extract file extension from original filename
//     const ext = path.extname(file.originalname).toLowerCase(); // Ensure lowercase extension
//     const uniqueName = Date.now() + ext; // Generate unique filename with extension
//     cb(null, uniqueName); // Save file with unique name including extension
//   },
// });

// const upload = multer({ storage }).single("image");

// const DATA_FILE = path.join(__dirname, "data.json");

// // Middleware to parse JSON bodies
// app.use(express.json());

// // GET all posts
// app.get("/api/posts", (req, res) => {
//   const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
//   res.json(data);
// });

// // POST a new post with text and image
// app.post("/api/posts", upload, (req, res) => {
//   const { text } = req.body;
//   const imageName = req.file ? req.file.filename : null; // Get image filename

//   // Basic validation for text and image
//   if (!text || !imageName) {
//     return res.status(400).json({ error: "Text and image are required!" });
//   }

//   // Read current data from the JSON file
//   const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

//   // Create a new post object
//   const newPost = {
//     id: Date.now(),
//     text,
//     image: imageName, // Save the image name (with extension)
//   };

//   // Add the new post to the existing data
//   data.push(newPost);

//   // Write the updated data back to the JSON file
//   fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

//   res.status(201).json(newPost);
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 5000;

const data = require("./data");

//  Enable CORS
app.use(cors());

// // // Serve static images from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // // API endpoint
app.get("/api/data", (req, res) => {
  res.json(data);
});

// DELETE a post by id
app.delete("/api/posts/:id", (req, res) => {
  const postId = req.params.id;

  // Read current data
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

  // Find if post exists
  const postIndex = data.findIndex((post) => post.id.toString() === postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Remove post from array
  const deletedPost = data.splice(postIndex, 1)[0];

  // Write updated data back to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  // Optionally, delete associated image file
  if (deletedPost.img) {
    const imgPath = path.join(uploadsDir, deletedPost.img);
    fs.unlink(imgPath, (err) => {
      if (err) console.error("Error deleting image file:", err);
    });
  }

  res.json({ message: "Post deleted successfully", post: deletedPost });
});

// Serve static images from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure the "uploads" folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

// 👇 Use 'img' to match the frontend field name
const upload = multer({ storage }).single("img");

const DATA_FILE = path.join(__dirname, "data.json");

// Middleware to parse JSON bodies
app.use(express.json());

// GET all posts
app.get("/api/posts", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

// POST a new post with caption and image
app.post("/api/posts", upload, (req, res) => {
  const { caption } = req.body;
  const imageName = req.file ? req.file.filename : null;

  // Basic validation for caption and image
  if (!caption || !imageName) {
    return res.status(400).json({ error: "Caption and image are required!" });
  }

  // Read current data from the JSON file
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

  // Create a new post object
  const newPost = {
    id: Date.now(),
    caption,
    dp: "dp.jpg",
    name: "Abhay Tiwari",
    uname: "@abhaykaran",
    img: imageName, // this stores only filename
  };

  // Add the new post to the existing data
  data.push(newPost);

  // Write the updated data back to the JSON file
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.status(201).json(newPost);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
