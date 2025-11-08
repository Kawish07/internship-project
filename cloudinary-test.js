require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Using cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.api.ping((err, res) => {
  if (err) {
    console.error('Cloudinary ping failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
  console.log('Cloudinary ping ok:', res);
  process.exit(0);
});
