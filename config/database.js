const mongoose = require('mongoose');

const DBconnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`DB connection : ${conn.connection.host}`);
  });
  
};

module.exports = DBconnection;
