// check-secret.js
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split(/\r?\n/);
const line = env.find(l => l.startsWith('CLOUDINARY_API_SECRET='));
if (!line) {
  console.log('CLOUDINARY_API_SECRET not found in .env');
  process.exit(1);
}
const value = line.split('=')[1] ?? '';
console.log('raw line:', JSON.stringify(line));
console.log('value visible part:', value.slice(0, 4) + '...' + value.slice(-4));
console.log('length:', value.length);
console.log('contains quotes?', value.startsWith('"') || value.startsWith("'") || value.endsWith('"') || value.endsWith("'"));