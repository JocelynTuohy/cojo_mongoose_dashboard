// CONSTANTS
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const session = require('express-session');
const PORT  = 8000;
// GENERAL CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, './static')));
// app.use(session({secret: ''}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// MONGOOSE CONFIG
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;
// MONGOOSE SCHEMAS + COLLECTIONS
var SharkSchema = new mongoose.Schema({
  name: String,
  age: Number
});
mongoose.model('Shark', SharkSchema);
var Shark = mongoose.model('Shark');
// VARIABLES
var errors = [];
// ROUTES
app.get('/', (req, res) => {
  let sharks = Shark.find()
  sharks
    .exec()
    .then((sharks)=>{
      // console.log(sharks);
      res.render('index', {sharks: sharks, errors: errors}); 
    })
   .catch((err)=>{
     console.log(err);
     res.redirect('http://www.google.com');
   })
})
app.get('/sharks/new', (req, res) => {
  res.render('newShark');
})
app.get('/sharks/edit/:id', (req, res) => {
  errors = [];
  let thisShark = Shark.findById(req.params.id);
  thisShark
  .exec()
  .then((thisShark)=>{
      res.render('editThisShark', {thisShark: thisShark})
    })
  .catch((err)=>{
    errors.push(err);
    res.redirect('/');
  });
})
app.post('/sharks/destroy/:id', (req, res) => {
  console.log('POST DATA', req.body);
  errors = [];
  Shark.remove({_id: req.params.id}, (err)=>{
    errors.push(err);
    res.redirect('/');
  })
});
app.get('/sharks/:id', (req, res) => {
  errors = [];
  let thisShark = Shark.findById(req.params.id);
  thisShark
  .exec()
  .then((shark)=>{
    res.render('thisShark', {thisShark: shark})
  })
  .catch((err)=>{
    console.log(err);
    errors.push(err);
    res.redirect('/');
  })
})
app.post('/sharks/:id', (req, res) => {
  errors = [];
  let thisShark = Shark.findByIdAndUpdate(
    req.params.id,
    {$set: {
      name: req.body.name,
      age: req.body.age
    }}
  );
  console.log(thisShark);
  thisShark
  .then((shark)=>{  
    res.redirect('/sharks/' + shark.id)
  })
  .catch((err)=>{
    errors.push(err);
    res.redirect('/')
  })
})
app.post('/sharks', (req, res) => {
  console.log('POST DATA', req.body);
  // req.session.thing = req.body.thing;
  var sharkInstance = new Shark();
  sharkInstance.name = req.body.name;
  sharkInstance.age = req.body.age;
  sharkInstance.save((err) => {
    if (err) {
      console.log('something went wrong!');
      res.redirect('/sharks/new');
    }
  })
  res.redirect('/');
})

// THE IMPORTANT SERVER BIT
app.listen(PORT, () => {
  console.log('listening on port' + PORT);
});

// for sockets setup:
// const server = app.listen(PORT, () => {
  // console.log('listening on port' + PORT);
// });
