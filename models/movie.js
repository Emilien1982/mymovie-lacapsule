const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {type: String, required: true},
  img: String,
  webServiceId: {type: Number, required: true}
});

module.exports = mongoose.model('movies', movieSchema);