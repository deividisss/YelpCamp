var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campgrounds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/* 
Campground.create(
  {
    name: "Granite Hill",
    image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
    description:
      "This is a huge granite hill, no bathrooms, no water, beautifull granite!"
  },
  function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      console.log("NEWLY CREATED CAMGROUND");
      console.log(campground);
    }
  }
); */

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX - show all camgrounds
app.get("/campgrounds", function(req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log("Something bad happend");
      console.log(err);
    } else {
      console.log("List of camgrounds");
      // console.log(allCampgrounds);
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE - add new campground to the database
app.post("/campgrounds", function(req, res) {
  console.log(req.body);
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: desc
  };

  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
  // res.send("Wtf");
  res.render("new.ejs");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
  //find camground with provided ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("show", { campground: foundCampground });
    }
  });
});

app.listen(3000, function() {
  console.log("Server is listening " + this.address().port);
});
