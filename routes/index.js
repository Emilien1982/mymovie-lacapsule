var express = require('express');
var router = express.Router();
const request = require('then-request');
const movieModel = require('../models/movie');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new-movies', async (req, res) => { 
  const rawData = await request('GET', `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`);
  const data = await JSON.parse(rawData.body);
  //console.log('DATA: ', data.results);
  res.json({result: true, movies: data.results});
});

router.get('/wishlist-movie', async (req, res) => {
  const movieList = await movieModel.find();
  return res.status(200).json({movieList});
})

router.post('/wishlist-movie', async (req,res) => {
  //console.log('BODY: ', req.body);
  const movieToAdd = new movieModel({
    name: decodeURIComponent(req.body.name),
    img: req.body.img,
    webServiceId: Number.parseInt(req.body.webServiceId)
  });
  const saved = await movieToAdd.save();
  //console.log('SAVED: ', saved);
  if (saved.id) {
    return res.status(201).json({added: true});
  } else {
    return res.status(400).json({added: false});
  }
});

router.delete('/wishlist-movie/:webServiceId', async (req, res) => {
  //console.log('WEBID: ', req.params.webServiceId);
  const result = await movieModel.deleteOne({webServiceId: req.params.webServiceId});
  //console.log('RESULT: ', result);
  if (result.deletedCount === 1) {
    return res.status(200).json({deleted: true});
  } else {
    return res.status(400).json({deleted: false});
  }
  
});

module.exports = router;
