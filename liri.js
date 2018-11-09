//read and set variables with dotenv
require("dotenv").config();
const fs = require('fs');
// add Request:
const request = require('request');
// add Moment.js:
const moment = require('moment');
//keys.js file:
const keys = require('./keys');
//Spotify API:
const Spotify = require('node-spotify-api');
//Export module Spotify API Keys:
const spotify = new Spotify(keys.spotify);
// OMDB AND BANDS IN TOWN API'S
let omdb = (keys.omdb);
let bandsintown = (keys.bandsInTown);

//user input
let userInput = process.argv[2];
//Grab the user query:
let userQuery = process.argv.slice(3).join(" ");

//Make a decision based on the commands:
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "concert-this":
            concertThis();
            break;
        case "do-what-it-says":
            doWhatItSays(userQuery);
            break;
        default:
            console.log("Not found, try Foogle Bot!");
            break;
    };
};

userCommand(userInput, userQuery);

function spotifyThisSong() {
    // if the user has not put any song in pass in "The Sign" by Ace of Base
    if (!userQuery.length) {
        userQuery = "ace of base the sign"
    };
    spotify.search({ type: 'track', query: userQuery, limit: 3 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        const arrayLimit = data.tracks.items;

        for (i = 0; i < arrayLimit.length; i++) {
            //console.log("currently listening too");
            console.log("artist: ", data.tracks.items[i].album.artists[0].name);
            console.log("song: ", data.tracks.items[i].name);
            console.log("spotify listening link: ", data.tracks.items[i].external_urls.spotify);
            console.log("album: ", data.tracks.items[i].album.name);
            console.log('-----------------------------');
        };
    });
};


function concertThis() {
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body) {
        // request worked:
        if (!error && response.statusCode === 200) {
            // JSON format
            let band = JSON.parse(body);
            // console.log(band) & console.log(band.length);
            if (band.length > 0) {
                for (i = 0; i < 3; i++) {
                    console.log("Your next concert:");
                    console.log("artist: ", band[i].lineup[0]);
                    console.log("venue:", band[i].venue.name);
                    console.log(`location: ${band[i].venue.city}, ${band[i].venue.country}`);
                    // Moment.js to format the date:
                    let date = moment(band[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log("Date and time:", date);
                    console.log('-----------------------------');
                };
            } else {
                // failed request
                console.log("try another band for concert information");
            };
        };
    });
};

function movieThis() {
    if (!userQuery) {
        userQuery = "mr nobody";
    };
    // REQUEST 
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=trilogy", function (error, response, body) {
        let movie = JSON.parse(body);
        // rotten tomatoes
        let ratingsArr = movie.Ratings;
        if (ratingsArr.length > 2) { }

        if (!error && response.statusCode === 200) {
            console.log(`Title: ${movie.Title}\nCast: ${movie.Actors}\nReleased: ${movie.Year}\nIMDb Rating: ${movie.imdbRating}\nRotten Tomatoes Rating: ${movie.Ratings[1].Value}\nCountry: ${movie.Country}\nLanguage: ${movie.Language}\nPlot: ${movie.Plot}\n\n`)
        } else {
            return console.log("movie not found, try another.  Error:" + error)
        };
    })
};

// Using the random.txt 
function doWhatItSays() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        // if error occurs
        if (error) {
            return console.log(error);
        }
        // Split the data in the random.txt 
        let dataArr = data.split(",");
        // Put the contents from the array as the user input and query:
        userInput = dataArr[0];
        userQuery = dataArr[1];
        // runs spotify-this-song for "I Want it That Way," as follows the text in random.txt

        userCommand(userInput, userQuery);
    });
};


