const express = require("express");
const multer = require("multer"); // Import Multer for file uploads
const cors = require("cors");     // Import CORS for React connection
const path = require("path");
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static("public")); // Serve images from public folder

// --- MULTER CONFIGURATION ---
// We use diskStorage to control exactly where files are saved and how they are named.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Files will be stored in the 'public' directory so they can be served statically
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        // REQUIREMENT: Rename the uploaded file based on the query parameter '?name='
        // This allows us to overwrite specific characters (e.g., 'tom.jpg') dynamically.
        const name = req.query.name;

        // Keep the original extension (e.g., .jpg or .png)
        const ext = path.extname(file.originalname) || ".jpg";

        // Final filename format: name + extension
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