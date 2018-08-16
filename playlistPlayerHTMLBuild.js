// API key to use the YouTube API
var apiKey = "AIzaSyDbwI3YwWxbg105jMVDcKOWl348UKHmIMw";
//var apiKey = "AIzaSyDag4I45HFd7eS92OQYOZa-71ftsJRZoIo";

// Max number of results to get (min is 0, max is 50)
var numMaxResults = 50;

// Playlist player variable. Initializes a player object that YouTube's API needs and will use.
var player;

var vidPlayerHeight = "";
var vidPlayerWidth = "100%";

// Get the videos in the playlist (stored in an array)
var ytPlaylists = [{
		videoPlayerId: 'ytplayer0',
		height: vidPlayerHeight,
		width: vidPlayerWidth,
		videoId: '-wAI_CbpiXU',
		playlistId: "PLfBnwDVE7DgHb386CMRB5RBnzmhGTm8Yh"
	},

	/*				   { videoPlayerId: 'ytplayer1', height: '500', width: '70%', videoId: 'NR3J0auqlM4', 
						playlistId: "PLfBnwDVE7DgFOlmXF6BekS5h2cbaIDSbY" }, 
					   { videoPlayerId: 'ytplayer2', height: '200', width: '50%', videoId: 'vY2SQKx9wRw', 
						playlistId: "PLfBnwDVE7DgHj-t0DrQSgxbuAq5xWgbDh" }*/
];

// Functions that load Javascript files and CSS files to source HTML file, including jQuery.
var Loader = function () {};
Loader.prototype = {
	require: function (scripts, callback) {
		this.loadCount = 0;
		this.totalRequired = scripts.length;
		this.callback = callback;

		for (var i = 0; i < scripts.length; i++) {
			this.writeScript(scripts[i]);
		}
	},
	loaded: function (evt) {
		this.loadCount++;

		if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
	},
	writeScript: function (src) {
		var self = this;
		var s = document.createElement('script');
		s.type = "text/javascript";
		s.async = true;
		s.src = src;
		s.addEventListener('load', function (e) {
			self.loaded(e);
		}, false);
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(s);
	}
};

// 3.3.1 version of jquery loaded below
var l = new Loader();
l.require([
		"https://code.jquery.com/jquery-3.3.1.min.js",

	],
	function () {
		// Callback
		console.log('All Scripts Loaded');
		main();
	});


// Main document ready function.
function main() {
	"use strict";
	$(document).ready(function () {
		pageHeightWidth();
		buildHTMLPlayerDivs();

		// Loads the YouTube API url and attaches the necessary piece of <script> code to the header, where it belongs.
		loadJavaScript('https://www.youtube.com/iframe_api');

		// Binds the click events to every <a> that is clicked in the div 'ia7__playlist-results', so that on click, the associated YouTube video player for that container has its src changed.
		$('.ia7__playlist-results').on('click', 'a', playlistClick);
	});
}

// Gets the iframe dimensions.
function pageHeightWidth() {
	"use strict";

	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		x = w.innerWidth || e.clientWidth || g.clientWidth,
		y = w.innerHeight || e.clientHeight || g.clientHeight;
	console.log('x = ' + x + ': y = ' + y);

	vidPlayerHeight = y;
	vidPlayerWidth = x;
	console.log("height = " + vidPlayerHeight + " width = " + vidPlayerWidth);
	/** height = 831.6 width = 754 **/

}

// Builds the appropriate divs on the HTML page for the playlist and youtube player to populate into.
function buildHTMLPlayerDivs() {
	"use strict";

	var htmlTarget = $("body");

	for (var i = 0; i < ytPlaylists.length; i++) {
		var playlistsContainerID = "playlistsContainer" + i;
		var $newContainer = $("<div ><h1></h1></div>"),

			vidPlayerHeight = ytPlaylists[i].height;
		
		vidPlayerHeight = 500;
		vidPlayerWidth = ytPlaylists[i].width;

		var $newdiv1 = "<div id='= " + playlistsContainerID + "'  class='ia7__row'> <div class='ia7__yt-video-playlist'> <div class='ia7__video-column'> <div class='ia7__yt-video' id='ytplayer" + i + "' style='height: " + vidPlayerHeight + ";' width: " + vidPlayerWidth + ";></div> <div class='ia7__yt-vid-description' style=' width: " + vidPlayerWidth + ";'></div> </div> <div class='ia7__playlist-column'> <h4 class='ia7__playlist-title ma__comp-heading'>Playlist</h4> <div class='ia7__playlist-container' style=' width: " + vidPlayerWidth + ";'> <div class='ia7__playlist-results ia7__row'> </div> </div> </div> </div> </div>";

		htmlTarget.append($newdiv1, $newContainer);
		console.log("pass: " + playlistsContainerID + "/n" + $newdiv1);
	}

}

// Loads the YouTube API url and attaches the necessary piece of <script> code to the header, where it belongs.
function loadJavaScript(url) {

	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = url;
	// Use any selector
	$("head").append(s);
}


// Prepares the values to be used in each playlist. For each playlist container:
// - Creates the actual ul playlist container, appends everything appropriately.
function buildPlaylist(playlistID, videoPlayerId, videoID) {
	// Gets the parent ia7__yt-video-playlist container, based on what the videoPlayerId of the <div id="ytplayer"> is.
	var parentDIV = $("#" + videoPlayerId).closest('.ia7__yt-video-playlist');

	// Playlist title (optional)
	var playlistTitle = "";

	// Gets the ia7__playlist-results div that is supposed to contain the results of the playlist items API call below.
	var playlistDIV = parentDIV.find('.ia7__playlist-results');

	// Gets the div that is supposed to be the playlist title div.
	var titleDIV = parentDIV.find('.ia7__playlist-title');

	// Gets the div that is supposed to contain the video description on the HTML page.
	var descriptionDIV = parentDIV.find('div.ia7__yt-vid-description');

	// Sets the 'ia7__playlist-title' for this particular ia7__yt-video-playlist container by making an API call.
	$.get(
		"https://www.googleapis.com/youtube/v3/playlists", {
			part: 'snippet',
			id: playlistID,
			key: apiKey
		},
		function (data) {
			$.each(data.items, function (i, item) {
				playlistTitle = item.snippet.title; // Gets the playlist title
				titleDIV.text("Playlist: " + playlistTitle); // Sets the title div to be that title
			});
		}
	);

	// Populates the 'ia7__playlist-results' by making an API call.
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			playlistId: playlistID,
			maxResults: numMaxResults,
			key: apiKey
		},
		function (data) {
			$.each(data.items, function (i, item) {
				// Adds the video ID to the ia7__playlist-results li item as a data- attribute to use for later when clicking on things,
				// and populates the playlist container with the videos' titles.
				playlistDIV.append('<div class="slideContainer25"><div class=" ia7__playlist-item"><a data-video_id=' + item.snippet.resourceId.videoId + ' class=" " ><div class="ia7__playlist-item__thumbnail"><img class="ma__image" alt="" title="' + item.snippet.description + '" src="' + item.snippet.thumbnails.medium.url + '"  style=" clear: both;"></div><div class="ia7__playlist-item__title-container">' + item.snippet.title + '</div></div></a></div>');

				// Also populates the video description divs in the same call, to save on API calls.				
				descriptionDIV.append("<div class='ia7__yt-description-content' data-video_id='" + item.snippet.resourceId.videoId + "' style='display: none;'>" + item.snippet.description + "</div>");
			});

			// Sets the initial video description (in 'ia7__yt-vid-description' div) for this particular ia7__yt-video-playlist container by showing the ia7__yt-description-content associated with this particular videoId.
			var initDescription = descriptionDIV.find('.ia7__yt-description-content[data-video_id="' + videoID + '"]');
			initDescription.show(); // Shows this one.
		}
	);
}

// Upon being clicked, the nearest video player is changed/clicked on. This is called from an <a> item in the ia7__playlist-results ul.
// Data is all stored as attributes.
function playlistClick() {
	$(".active").not(($(this).parent()).addClass('active')).removeClass('active');

	var parentDIV = $(this).closest('.ia7__yt-video-playlist');

	// Finds the main video player <div> that this container is connected to. Should actually be an iframe (which is a div in the HTML document) that has an id that starts with 'ytplayer'. YouTube changes the div into an iframe, so keep it as iframe.
	var vidPlayer = parentDIV.find('iframe[id^="ytplayer"]');

	// Get the div id of the this particular video player from vidPlayer's id name in the div.
	var playerID = vidPlayer.attr('id');

	// Gets the playlist ID from the object in the list ytPlaylists that it corresponds to. E.g. gets the playlistId of the YTPlayer with the videoPlayerId of ytplayer0
	var listID = $.grep(ytPlaylists, function (obj) {
		return obj.videoPlayerId === playerID;
	})[0].playlistId;

	// Gets the video ID stored in this particular li as a data-video_id item.
	var vidID = $(this).data('video_id');

	// And then sets the video player src to the video ID.
	vidPlayer.attr("src", "https://www.youtube.com/embed/" + vidID + "?list=" + listID);

	// Changes the description in the closest ia7__yt-vid-description box (aka the one associated with this video playlist container) to update the content so that it matches what the current video is now.
	// The descriptions are loaded into invisible divs and hidden ahead of time via display: none; it's just a matter of displaying the right one at the right time.
	// Goes up to the ia7__yt-vid-description block, finds the nearest ia7__yt-description-content div (that has the same data-video-id as this clicked-on item), and then changes its css style.
	// This matches the appropriate div via the data-video_id attribute.
	var description = parentDIV.find('.ia7__yt-description-content[data-video_id="' + vidID + '"]');

	description.show(); // Shows this one.
	description.siblings().hide(); // Hides the rest of the siblings.
}

// Works with the YouTube API to create the YouTube video player and playlist.
function onYouTubeIframeAPIReady() {
	if (typeof ytPlaylists === 'undefined') {
		console.log("ytPlaylists is undefined");
		return;
	}

	// Goes through the ytPlaylists array and builds each video in it.
	for (var i = 0; i < ytPlaylists.length; i++) {
		var currentPlayer = createPlayer(ytPlaylists[i]);

		// Builds the playlist containers with the playlist ID and the id of the div or iframe element.
		buildPlaylist(ytPlaylists[i].playlistId, ytPlaylists[i].videoPlayerId, ytPlaylists[i].videoId);
	}
}

// Works with the YouTube API to create the YouTube video player and playlist.
function createPlayer(playerInfo) {
	return new YT.Player(playerInfo.videoPlayerId, {
		width: playerInfo.width,
		videoId: playerInfo.videoId,
		playerVars: {
			listType: "playlist",
			list: playerInfo.playlistId,
			rel: 0
		},
		events: {
			"onReady": onPlayerReady,
			"onStateChange": onPlayerStateChange
		}
	});
}

// YouTube playlist function.
function onPlayerReady(event) {
	event.target.setVolume(80);
}

// YouTube playlist function to pause the video.
function stopVideo() {
	player.stopVideo();
}

// YouTube playlist function that stops the video when the video ends.
function onPlayerStateChange(num) {
	if (event.data == YT.PlayerState.ENDED) {
		player.stopVideo();
		console.log("onPlayerStateChange: " + num);
	}
}
