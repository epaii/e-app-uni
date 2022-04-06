import ui from "./ui"
import api from "./api"
import uploader from './uploader.js'
let config = require("../config");
export default function(eapp) {


	eapp.ui = ui;

	eapp.localData = {
		set(key, value) {

			try {
				uni.setStorageSync(key, value);
			} catch (e) {
				console.log(e)
			}
		},
		get(key) {

			return uni.getStorageSync(key)
		},
		remove(key) {
			try {
				uni.removeStorageSync(key);
			} catch (e) {
				//ui.alert(e) 
			}
		},
		clear() {
			uni.clearStorageSync();
		}
	};
	api.eapp = eapp;
	eapp.http = api;

	eapp.window = {
		listener: {
			beforIn(url, next) {
				next();
			},
			openInBrowser(url) {
				eapp.window.open("/epii/eapp-uni/webview?url=" + encodeURIComponent(url))
			}
		},
		url() {

			let tourl = "";
			// #ifdef H5
			tourl = getApp()._route.path;
			// #endif
			// #ifdef APP-PLUS
			let pages = getCurrentPages();
			let curPage = pages[pages.length - 1];

			return "/" + curPage.route;
			// #endif
			return tourl;
		},
		stopPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		open(url) {
			if (url.startsWith("http")) {
				this.listener.openInBrowser(url);
				return;
			}
			eapp.window.listener.beforIn(url, () => {

				if (url.indexOf("/pages/tabs/") === 0) {
					console.log(url)
					uni.switchTab({
						url: url
					})
				} else
					uni.navigateTo({
						url: url
					});
			})

		},
		replace(url) {
			eapp.window.listener.beforIn(url, () => {
				if (url.indexOf("/pages/tabs/") === 0) {
					uni.switchTab({
						url: url
					})
				} else
					uni.redirectTo({
						url: url
					})
			})

		},
		params(key = null) {



			// #ifdef H5
			
			if (key === null) return getApp().$route.query
			else return getApp().$route.query[key] ? getApp().$route.query[key] : ""
			
			// #endif
			
			// #ifdef APP-PLUS
			
			let pages = getCurrentPages();
			let options = pages[pages.length - 1].options;
			if (key === null) return options;
			else return options[key] ? options[key] : ""
 
			
			// #endif




		},
		go(index) {
			uni.navigateBack({
				delta: -index
			})
		},
		back() {
			eapp.window.go(-1)
		},
		setTitle(title) {
			uni.setNavigationBarTitle({
				title: title
			});
		},
		reLaunch(url) {
			uni.reLaunch({
				url: url
			});
		}

	};
	eapp.event = {
		login(callback) {
			uni.$on("sys_login", callback);
		},
		logout(callback) {
			uni.$on("sys_logout", callback);
		},
		on(name, callback) {
			uni.$on(name, callback);
		},
		emit(name, data = null) {
			uni.$emit(name, data);
		},
		once(name, callback) {
			uni.$once(name, callback);
		},
		off(name, callback) {
			uni.$off(name, callback)
		}

	}

	eapp.device = {
		getLocation(callback) {
			config.functions.getLocation({
			    type: 'wgs84',
			    success: callback
			});
		},
		chooseLocation(callback) {
			config.functions.chooseLocation({
                success: callback
            });
		},
		openLocation(options){
			config.functions.openLocation(options)
		},
		makePhoneCall(phoneNumber) {
			config.functions.makePhoneCall({ phoneNumber: phoneNumber });
		},
		scanCode(callback, option = null) {
			let data = {
				success: function(res) {
					callback(res.result)
				}
			};
			if (option !== null) {
				if (typeof option === "object") {
					data = Object.assign(data, option);
				} else if (typeof option === "boolean") {
					data.onlyFromCamera = option;
				}
			}
			uni.scanCode(data);
		}

	}

	eapp.exit = function() {

		// #ifdef APP-PLUS
		if (uni.getSystemInfoSync().platform == 'ios') {
			plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
		} else if (uni.getSystemInfoSync().platform == 'android') {
			plus.runtime.quit();
		}
		// #endif

	}
	uploader.eapp = eapp;

	eapp.uploader = uploader;
}
