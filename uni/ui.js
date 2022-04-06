let isloading = false;
let last_load_time = 0;
export default {
	showActionSheet(options) {
		let keys = [];
		let funs = [];
		for (let index in options) {
			keys.push(index);
			funs.push(options[index]);
		}
		uni.showActionSheet({
			itemList: keys,
			success: function (res) {
				funs[res.tapIndex]();
			},
			fail: function (res) {
				console.log(res.errMsg);
			}
		});
	},
	previewImage(images, index = 0) {
		uni.previewImage({
			current: index,
			urls: images
		})
	},
	confirm(config, callbcak, cancel) {

		if (typeof config === "string") {
			config = {
				content: config
			}
		}

		uni.showModal(Object.assign({
			title: "提示",

			confirmText: "确定",
			cancelText: "取消",
			success: (res) => {
				if (res.confirm) {
					callbcak();
				} else if (res.cancel && cancel) {
					cancel();
				}
			},
			fail: cancel
		}, config))

	},
	alert(config, callbcak) {
		if (typeof config === "string") {
			config = {
				content: config
			}
		}
		// weui.alert(message);
		// return;
		uni.showModal(Object.assign({
			title: "提示",
			showCancel: false,
			confirmText: "确定",
			success: callbcak
		}, config))

	},
	loading(msg = "请稍等") {
		if(isloading) return;
		let n_time = new Date().getTime();
		if(n_time-last_load_time<500){
			return;
		}
		isloading = true;
		uni.showToast({
			title: msg,
			icon: "loading",
			duration: 20000
		})
	},
	stopLoading() {
		if (isloading)
		{
			this.stop_loading();
			last_load_time = new Date().getTime();
		}
			
		isloading = false;
	},
	stop_loading() {
		uni.hideToast()
	},
	toast: {
		success(msg = "操作成功") {
			uni.showToast({
				title: msg
			})
		},
		text(msg) {
			uni.showToast({
				title: msg,
				position: "middle",
				icon: "none"
			})
		},
		fail(msg = "失败") {
			uni.showToast({
				title: msg,
				icon: "error"
			})
		}
	}

}