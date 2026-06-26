const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Error: Please provide a password as an argument.');
  console.log('Usage: node utils/hash.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('\n--- Bcrypt Password Hash Generator ---');
  console.log(`Password: ${password}`);
  console.log(`Hash:     ${hash}\n`);
});
