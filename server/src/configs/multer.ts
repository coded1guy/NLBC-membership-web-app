import multer from "multer";

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store the uploaded file in memory
const upload = multer({ storage });

export default upload;
