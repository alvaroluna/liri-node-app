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
}

function Main() {
  // instantiate API_engine
  var apiObj = new API_engine(search);

  if (process.argv[2]) {
    var searchTerm = process.argv.splice(3);
    var concatinate = searchTerm.join();

    switch (process.argv[3]) {
      case "film":
        apiObj.filmAPI();
      case "music":
        apiObj.spotifyAPI();
      case "concert":
        apiObj.bandsInTownAPI();
    }
  } else {
    console.log(
      "Provide a search term and select API library (film | song | something | something)"
    );
  }
}

Main();
