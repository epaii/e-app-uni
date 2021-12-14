import ui from "./ui"

let url_pre = "";
let base_data = {};

let dataHandler = null;

function mk_on_success_option(options, onsuccess, error, native = false) {
    options.complete = () => {
            ui.stopLoading()
        },
        options.success = (result) => {
            result = result.data
            if (result && result.hasOwnProperty("code")) {
                if (result.code === 0) {
                    if (result.data && result.data.e_type && (result.data.e_type === "login")) {

                        this.eapp.user.onTokenExpired(result.data);
                        return;
                    }
                    if (result.data && result.data.error_type && (result.data.error_type === "auth")) {
                        if (this.eapp.user && (typeof this.eapp.user.onTokenExpired === "function")) {
                            this.eapp.localData.remove('token');
                            this.eapp.user.onTokenExpired(result.data);
                        } else {
                            this.eapp.localData.remove('token');
                            ui.alert("账号已经退出，请重新打开应用并登录", () => {
                                this.eapp.exit();
                            })
                        }

                        return;
                    }
                    if (error) {
                        if (native) ui.alert(result.msg)
                        else
                            error(result.msg)
                    } else {
                        ui.alert(result.msg)
                    }
                } else {
                    if (dataHandler && (typeof dataHandler === "function")) {
                        onsuccess(dataHandler(result.data))
                    } else
                        onsuccess(result.data)
                }
            } else {

                if (error)
                    error("其它错误")
                else {
                    ui.alert("其它错误")
                }
            }

        };
}


let api = {
    setDataHander(handler) {
        dataHandler = handler;
    },
    eapp: null,
    setApiBase(_url_pre) {

        url_pre = _url_pre;
    },
    getApiBase() {
        return url_pre;
    },
    setBaseData(data) {
        Object.assign(base_data, data)
    },

    loading: {
        post(uri, data = {}, onsuccess = null, onerror = null) {


            ui.loading();

            if (onsuccess)
                api.post(uri, data, function () {
                    ui.stop_loading();
                    onsuccess.apply(null, arguments);
                }, function () {
                    ui.stop_loading();
                    if (onerror) onerror.apply(null, arguments)
                    else
                        ui.alert(arguments[0])
                });
            else {

                return new Promise((ok, error) => {
                    api.post(uri, data).then(function () {

                        ui.stop_loading();
                        ok.apply(null, arguments);
                    }).catch(() => {
                        ui.stop_loading();
                        if (error) error();
                        else ui.alert("异常")
                    })
                })


            }
        }
    },
    post(uri, data = {}, onsuccess = null, onerror = null) {
        let options = {
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            }
        };


        options.data = {};
        options.data = Object.assign(options.data, base_data, data);

        if (uri.indexOf("http") === 0) {
            options.url = uri;
        } else
            options.url = this.eapp.config.api_url_base + uri

        if (onsuccess) {
            mk_on_success_option.call(this, options, onsuccess, onerror)
            if (!onerror) onerror = (xhr, status, error) => {

            };
            options.fail = onerror;

            uni.request(options);
        } else {

            return new Promise((ok, error) => {
                mk_on_success_option.call(this, options, ok, error, true)
                uni.request(options);
            });
        }


    }
};

export default api