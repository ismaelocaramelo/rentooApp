module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB_URI || 'mongodb://localhost/rentoo-app',
  api: 'http://localhost:3000',
  secret: 'supersecret'
};
