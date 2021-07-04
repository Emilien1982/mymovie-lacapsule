const mongoose = require('mongoose');

var options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

mongoose.connect(process.env.DB_CONNECTION_URL,
  options,
  function(err){
      console.log(err? err : 'Connection à la BDD OK!');
  }
)

module.exports = mongoose