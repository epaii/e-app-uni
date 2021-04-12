
let config = require("./config");

import _eapp from "./uni/eapp";

let callback_s = [];
let isReady = false;
function onReady(callback) {
	if (isReady)
		callback();
	else callback_s.push(callback)
}
let eapp = {
	onReady: onReady,
	initialize: (options, config_dir = null) => {
		if (options)
			for (let index in options)
				config[index] = options[index]
		_eapp(eapp);
		callback_s.forEach((f) => {
			f()
		})
	},
	extends: (callback) => {
		callback.call(this)
	},
	this: {
	},
	config: {

	}

}


module.exports = eapp

