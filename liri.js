function API_engine(searchTerm) {
  this.searchTerm = searchTerm;

  //   axios object
  this.axiosObj = require("axios");

  //    spotify api method
  this.spotifyAPI = function() {
    var spotifyAPI = require("spotify");
  };

  //    film api method
  this.filmAPI = function() {
    this.axiosObj
      .get(
        "http://www.omdbapi.com/?t=" +
          this.searchTerm +
          "&y=&plot=short&apikey=trilogy"
      )
      .then(function(response) {
        console.log(response);
        console.log("The movie's rating is: " + response.data.imdbRating);
      });
  };

  this.bandsInTownAPI = function() {};

  //    error whatever
  this.error = function() {
    console.log(
      "Please specify search term film | song | something | something"
    );
  };
}

function Main() {
  var search = process.argv[3];

  // instantiate API_engine
  var apiObj = new API_engine(search);

  switch (process.argv[2]) {
    case "film":
      apiObj.filmAPI();
    case "music":
      apiObj.spotifyAPI();
    case "concert":
      apiObj.bandsInTownAPI();
  }
}

Main();
