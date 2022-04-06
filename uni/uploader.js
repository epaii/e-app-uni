import ui from "./ui.js"
let config = require("../config");
let upload_url;
let uploader = {
	setUploadApi(url) { 
		upload_url = url;
	},
	getUploadApi(){
			return upload_url;
	},
	uploadFiles(tempFiles,callback,thisapi){
		 
		let uploadFile = config.functions.uploadFile;
		 
		if(!thisapi) thisapi = upload_url;
		var outpath = [];
		var allthread = [];
	 
 
		for (var i in tempFiles) {
			 
			allthread.push(uploadFile({
				url: thisapi,
				filePath: tempFiles[i].path,
				name: 'file',
				formData: {
					'token': this.eapp.localData.get("token")
				}
			}));
		}
		 
		 
		 Promise.all(allthread).then((datas) => {
			 
			datas.forEach(item=>{
				let [err,res] = item;
				 
				if(err === null)
				{		 
					let data = JSON.parse(res.data);
					 
					if(data.code-1===0)
					{
						outpath.push(data.data.url);
					}else{
						ui.alert(data.msg)
					}
				}
			});
			 callback(outpath)
			
		}).catch((error) => {
			// console.log(error)
		})
	},
	chooseImageAndUpload(options, callback) {
		let thisapi = upload_url;
		if (options.hasOwnProperty("url")) {
			thisapi = options.url;
		}
	 
		let that = this;
		let  chooseImage = config.functions.chooseImage;
		 
		

		chooseImage(Object.assign({
			
			
			count: 9, // 默认9
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: function(res) {
				ui.loading();
				 
				uploader.uploadFiles(res.tempFiles,(res)=>{
					callback(res.join(","));
					ui.stopLoading();
				},thisapi)
			},
			fail(res) {
				// JSON.stringify(res)
				console.log('--------------------------')
				
				console.log(res)
				console.log('--------------------------')
			}
		}, options));

	},
	
	downloadFile(fileUrl,callback) {
		uni.downloadFile({
			url: fileUrl,
			success: (res) => {
				if (res.statusCode === 200) {
					config.functions.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							callback(res.tempFilePath);
						},
						fail: function() {
							
						}
					});
				}
			}
		})
	},
	
	shareUrl(title,url)
	{
		config.functions.shareWithSystem({
			summary: title,
			href: url,
			success(){
				
			},
			fail(){

			}
		})
	}
}
export default uploader;
