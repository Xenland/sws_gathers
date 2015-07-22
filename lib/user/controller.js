"use strict";

/*
 * User Controller
 *
 * Server API
 * message:new - New message needs to be displayed
 * message:refresh - Reload all messages
 *
 * Client API
 * message:new - New message has been created
 * message:refresh - Retrieve most recent messages
 *
 */

var fs = require("fs");
var path = require("path");
var enslClient = require(path.join(__dirname, "../ensl/client"))();
var winston = require("winston");
var userCache = {};

module.exports = function (namespace) {
	var refreshUsers = function (socket) {
		var receiver = (socket !== undefined) ? socket : namespace;
		
		var newCache = {};
		namespace.sockets.forEach(function (socket) {
			var user = socket._user;
			newCache[user.id] = user;
		});
		userCache = newCache;

		var users = [];

		for (var id in userCache) {
			if (userCache.hasOwnProperty(id)) {
				users.push(userCache[id]);
			}
		}

		receiver.emit('userCount', {
			count: users.length,
			users: users
		});		
	};

	namespace.on('connection', function (socket) {
		refreshUsers();
	  
		socket.on('refreshUsers', refreshUsers.bind(null, socket));

		socket.on("users:authorize", function (data) {
			var id = parseInt(data.id, 10);
			if (isNaN(id)) return;
			enslClient.getUserById({
				id: id
			}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					winston.error("An error occurred in authorising id", id);
					winston.error(error);
					winston.error("ENSL API status:", response.statusCode);
					return;
				}
				socket._user = body;
				refreshUsers();
			});
		});

	  socket.on('disconnect', function (socket) {
	    refreshUsers();
	  });
	});
};