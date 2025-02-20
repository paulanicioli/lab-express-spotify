require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artist-search', (req, res) => {
  const { artistName } = req.query;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((val) => {
      res.render('albums', { albums: val.body.items });
    })
    .catch((err) => console.log('Error rendering albums ==> ', err));
});

app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((val) => {
      console.log(val.body.items[2].preview_url);
      res.render('tracks', { tracks: val.body.items });
    })
    .catch((err) => console.log('Error rendering tracks ==> ', err));
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
