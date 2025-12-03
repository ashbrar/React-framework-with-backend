const express = require("express");
const multer = require("multer"); // Import Multer for file uploads
const cors = require("cors");     // Import CORS for React connection
const path = require("path");
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static("public")); // Serve images from public folder

// --- MULTER CONFIGURATION (New Code) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public"); // Save files to the public folder
    },
    filename: (req, file, cb) => {
        // RENAME logic: Use the 'name' query param + original extension
        // If ?name=tom, file becomes tom.jpg
        const name = req.query.name;
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, `${name}${ext}`);
    }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Upload Route (New Code for Objective 1)
app.post("/api/upload", upload.single("imageFile"), (req, res) => {
    // Multer has already saved and renamed the file by now
    res.json({ message: "File uploaded successfully" });
});

// 2. Get Image Route (Your Professor's Existing Logic)
app.get("/api/getImage", (req, res) => {
    const name = req.query.name.toLowerCase();

    // Default image if no match found
    let image = "default.jpg";

    if (name.includes("tom")) image = "tom.jpg";
    if (name.includes("jerry")) image = "jerry.jpg";
    if (name.includes("dog")) image = "dog.jpg";

    // Returns JSON with the URL
    res.json({ url: "http://localhost:3000/" + image });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});