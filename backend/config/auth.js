require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error(
    'Missing required environment variable SECRET in backend/.env. Set a secure value before starting the backend.',
  );
}

module.exports = {
    SECRET
};