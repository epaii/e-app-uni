


const fs = require('fs')
const work_dir =  __dirname+"/../../epii/eapp-uni"
if(!fs.existsSync(work_dir)){
    fs.mkdirSync(work_dir,{ recursive: true });
}
let webvie_file = work_dir+"/webview.vue";
let runner={
    install() {
        this.uninstall();
        fs.copyFileSync(__dirname+"/webview.vue",webvie_file);
    },
    uninstall() {
        if(fs.existsSync(webvie_file)){
            fs.unlinkSync(webvie_file);
       }
    }
}


if(process.argv.length==3){
    if(runner.hasOwnProperty(process.argv[2])){
        runner[process.argv[2]].apply(runner);
    }
}

 