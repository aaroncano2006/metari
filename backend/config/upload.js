const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/proofs"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `temp_${Date.now()}${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowed = /.(jpeg|jpg|png|webp)$/i;
    const extOk = allowed.test(path.extname(file.originalname));
    cb(extOk ? null : new Error("Només imatges (jpeg, png, webp)"), extOk);
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
module.exports = upload;
