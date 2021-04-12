import ui from "./ui"

let url_pre = "";
let base_data = {};


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
                    if (error) {
                        if (native) ui.alert(result.msg)
                        else
                            error(result.msg)
                    } else {
                        ui.alert(result.msg)
                    }
                } else {
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