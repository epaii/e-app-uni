import ui from "./ui"
import api from "./api"
import uploader from './uploader.js'
export default function (eapp) {


    eapp.ui = ui;
    api.eapp = eapp;
    eapp.http = api;
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

    eapp.window = {
        listener: {
            beforIn(url, next) {
                next();
            },
            openInBrowser(url) {
                eapp.window.open("/epii/eapp-uni/webview?url="+encodeURIComponent(url))
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
                if(url.indexOf("/pages/tabs/")===0){
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
                if(url.indexOf("/pages/tabs/")===0){
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
		
            if (key === null) return getApp().$route.query
            else return getApp().$route.query[key] ? getApp().$route.query[key] : ""

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
        }

    }

    eapp.device = {
        chooseLocation(callback) {
            uni.chooseLocation({
                success: callback
            });
        },
        makePhoneCall(phoneNumber) {
            uni.makePhoneCall({ phoneNumber: phoneNumber });
        }

    }

    eapp.exit = function () {

        // #ifdef APP-PLUS
        if (plus.os.name.toLowerCase() === 'android') {
            plus.runtime.quit();
        }
        else {
            ui.toast.text("请手动退出进程");

        }
        // #endif

    }
    uploader.eapp = eapp;

    eapp.uploader = uploader;
}