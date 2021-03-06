"use strict";

var env = process.env.NODE_ENV || "development";
var test = env === "test";

var fs = require("fs");
var path = require("path");

var baseConfig = require(path.join(__dirname, path.join("environments/" + env.toLowerCase())));

baseConfig.steamBot = {};

if (!test) {
	if (process.env.PORT) {
		baseConfig.port = parseInt(process.env.PORT, 10);
	}

	if (process.env.MONGOLAB_URI) {
		baseConfig.mongo.uri = process.env.MONGOLAB_URI;
	}

	if (process.env.RAILS_SECRET) {
		baseConfig.secret_token = process.env.RAILS_SECRET;
	}

	if (process.env.GATHER_STEAM_ACCOUNT) {
		baseConfig.steamBot.account_name = process.env.GATHER_STEAM_ACCOUNT;
	}

	if (process.env.GATHER_STEAM_PASSWORD) {
		baseConfig.steamBot.password = process.env.GATHER_STEAM_PASSWORD;
	}
}

module.exports = baseConfig;
