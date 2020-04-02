// ----------------------- //
// PROGRAM BEGINS @ Main() //
// ----------------------- //

// GLOBAL VARIABLES
require("dotenv").config(); // read and set any environment variables with the dotenv package
var fs = require("fs");
var moment = require("moment");
var keys = require("./keys.js"); //   import API keys
var axios = require("axios"); //   axios object
var moment = require("moment");

// ---------------- //
// HELPER FUNCTIONS //
// ---------------- //
function WordWrap(str, maxWidth) {
  var newLineStr = "\n";
  done = false;
  res = "";
  while (str.length > maxWidth) {
    found = false;
    // Inserts new line at first whitespace of the line
    for (i = maxWidth - 1; i >= 0; i--) {
      if (TestWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join("");
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join("");
      str = str.slice(maxWidth);
    }
  }

  return res + str;
}

function TestWhite(x) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

// --------------- //
// API CONSTRUCTOR //
// --------------- //
function API_engine() {
  //    spotify api method
  this.spotifyAPI = function(searchTerm = "The Sign", print = true) {
    var Spotify = require("node-spotify-api");
    var spotify = new Spotify(keys.spotify); // these objects are chosen as exports explicitly from keys.js

    spotify.search({ type: "track", query: searchTerm, limit: 5 }, function(
      err,
      data
    ) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      var dataOut = [];
      // Do something with 'data'
      for (i = 0; i < data.tracks.items.length; i++) {
        // data variables
        var artist = data.tracks.items[i].album.artists[0].name;
        var songName = data.tracks.items[i].name;
        var songLink = data.tracks.items[i].album.external_urls.spotify;
        var albumName = data.tracks.items[i].album.name;

        var tempdata = [
          "\n-----------------------------------",
          "Spotify Search: " + searchTerm,
          "-----------------------------------",
          "Artist:" + "\n\t" + artist + "\n",
          "Song Name:" + "\n\t" + songName + "\n",
          "Song Link:" + "\n\t" + songLink + "\n",
          "Album:" + "\n\t" + albumName,
          "-----------------------------------\n"
        ];

        dataOut.push(JSON.stringify(tempdata));
        // console.log(tempdata);

        if (print) {
          // console print
          if (i === 0) {
            console.log("\n-----------------------------------");
            console.log("Spotify Search: " + searchTerm);
            console.log("-----------------------------------");
          } else {
            console.log("-----------------------------------");
          }

          console.log("Artist:" + "\n\t" + artist + "\n");
          console.log("Song Name:" + "\n\t" + songName + "\n");
          console.log("Song Link:" + "\n\t" + songLink + "\n");
          console.log("Album:" + "\n\t" + albumName);
          if (i === data.tracks.items.length - 1) {
            console.log("-----------------------------------\n");
          } else {
            console.log();
          }
        }
      }
      return dataOut;
    });
  };

  //    movie api method
  this.MovieAPI = function(searchTerm = "Mr. Nobody", print = true) {
    axios
      .get(
        "http://www.omdbapi.com/?t=" +
          searchTerm +
          "&y=&plot=short&apikey=trilogy"
      )
      .then(function(response) {
        var title = response.data.Title;
        var year = response.data.Year;
        var imbdRating = response.data.imdbRating; // imbd rating
        var rtRating = response.data.Ratings.Value; // rotten tomatoes rating
        var country = response.data.Country;
        var language = response.data.Language;
        var plot = WordWrap(response.data.Plot, 60);
        var cast = response.data.Actors;

        if (print) {
          // print results
          console.log("\n-----------------------------------");
          console.log("OMBD Search: " + searchTerm);
          console.log("-----------------------------------");
          console.log("Title:" + "\n\t" + title + "\n");
          console.log("Year:" + "\n\t" + year + "\n");
          console.log("IMBD Rating:" + "\n\t" + imbdRating + "\n");
          console.log("Rotten Tomatoes Rating:" + "\n\t" + rtRating + "\n");
          console.log("Country:" + "\n\t" + country + "\n");
          console.log("Language:" + "\n\t" + language + "\n");
          console.log("Plot Summary:" + "\n\t" + plot + "\n");
          console.log("Cast:" + "\n\t" + cast);
          console.log("-----------------------------------\n");
        }
      });
  };

  //   bands in town api method
  this.BandsInTownAPI = function(searchTerm = "Celine Dion", print = true) {
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          searchTerm +
          "/events?app_id=codingbootcamp"
      )
      // can't
      .then(function(response) {
        for (i = 0; i < response.data.length; i++) {
          var venue = response.data[i].venue.name;
          var venueCity = response.data[i].venue.city;
          var venueRegion = response.data[i].venue.region;
          var venueCountry = response.data[i].venue.country;
          var venueLocation =
            venueCity + ", " + venueRegion + " " + venueCountry;
          var eventDate = response.data[i].datetime; //  date of the event (use moment to format this as "MM/DD/YYYY")
          eventDate = moment(eventDate).format("MM/DD/YYYY"); //

          if (print) {
            // print results
            if (i === 0) {
              console.log("\n-----------------------------------");
              console.log("Bands In Town Search: " + searchTerm);
              console.log("-----------------------------------");
            } else {
              console.log("-----------------------------------");
            }

            console.log("Venue:" + "\n\t" + venue + "\n");
            console.log("Venue Location:" + "\n\t" + venueLocation + "\n");
            console.log("Event Date:" + "\n\t" + eventDate);
            if (i === response.data.length - 1) {
              console.log("-----------------------------------\n");
            } else {
              console.log();
            }
          }
        }
      });
  };

  this.WriteLog = function(data) {
    fs.appendFile("log.txt", data, function(err) {
      if (err) throw err;
      console.log("Updated!");
    });
  };
}

// ------------- //
// MAIN FUNCTION //
// ------------- //
function Main() {
  //   check if there is a input that could be API search type
  if (process.argv[2]) {
    var apiChoice = process.argv[2];

    // format user input if it exists, otherwise do nothing and use method default
    if (process.argv[3]) {
      var searchTerm = process.argv
        .splice(3)
        .join()
        .replace(/,/g, " ");
    }

    // instantiate API_engine - create new instance
    var apiObj = new API_engine();

    // check which api is chosen through console input by user
    if (apiChoice === "do-what-it-says") {
      try {
        const data = fs.readFileSync("random.txt", "utf8");
        var str = data.split(",");
        apiChoice = str[0];
        searchTerm = str[1].replace(/"/g, "");
      } catch (err) {
        console.error(err);
      }
    }

    switch (apiChoice) {
      case "movie-this":
        var results = apiObj.MovieAPI((searchTerm = searchTerm), true);
        break;
      case "spotify-this-song":
        var results = apiObj.spotifyAPI((searchTerm = searchTerm), true);
        console.log(results);
        break;
      case "concert-this":
        var results = apiObj.BandsInTownAPI((searchTerm = searchTerm), true);
        break;
    }
    // write results to log.txt
    apiObj.WriteLog(results);
  } else {
    console.log(
      "\nPlease select an API library to search:\n    + movie-this <movie name here>\n    + spotify-this-song <song name here> \n    + concert-this <artist/band name here> \n    + do-what-it-says | result from random.txt file\n"
    );
  }
}

// program begins here
Main();
