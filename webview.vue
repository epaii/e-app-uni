<template>
	<web-view :src="src"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				src: ""
			};
		},
		onLoad(options) {
		
			let uid = Eapp.localData.get("token");
			let src  =decodeURIComponent(options.url) ;
			if(src.indexOf("?")>0) src =src +`&utoken=${uid}`
			else src =src +`?utoken=${uid}`
			this.src = src;
		}
	}
</script>

<style>
</style>
