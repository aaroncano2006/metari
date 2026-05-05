require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const SECRET = process.env.SECRET;

module.exports = {
    SECRET
};