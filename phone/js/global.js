var version = '00.00.0001';  //当前app版本号
var verURL = 'http://www.ldmao.com/index.php?g=app&m=index&a=update';  //版本更新地址
var androidURL = '';

var app = {
    str2JSON:function(url){
        var obj = {};
        var keyValue = [];
        var key = '', value = '';
        var paraString = url.substring(url.indexOf("?")+1, url.length).split("&");
        for(var i in paraString) {
            keyValue = paraString[i].split("=");
            key = keyValue[0];
            value = decodeURIComponent(keyValue[1]);
            obj[key] = value;
        }
        return obj;
    },
    checkVersion:function() {  //检查是否有新版本
    
        uexXmlHttpMgr.onData = function(opId, status, result) {
            if(status == -1) {
                appcan.window.openToast("连接不上网络^_^哦", 3000, 5, 0);
            }else if(status == 1) {
                appcan.window.closeToast();
                if(result == "") {
                    appcan.window.openToast("获取不到更新数据", 2000, 5, 0);
                }else {
                
                    var result = typeof(result) == 'string' ? eval('(' + result + ')') : result;
                    androidURL = result.android;
                    var lastVersion = result.version.split('.');
                    var curVersion = version.split('.');
                    var bl = false;
                    if(lastVersion[0] > curVersion[0]) {
                        bl = true;
                    }else if(lastVersion[1] > curVersion[1]){
                        bl = true;
                    }else if(lastVersion[2] > curVersion[2]) {
                        bl = true;
                    }
                    if(bl) {
                        var btn = ['稍后', '更新'];
                        uexWindow.confirm('提示', '当前有新版本(' + result.version + ')，是否更新？', btn);
                    }
                }
            }
        };
        uexXmlHttpMgr.open(777, "get", verURL, "");
        uexXmlHttpMgr.send(777);
    },
    update:function() {  // 更新APP
    
        //第七步：监听下载状态
        uexDownloaderMgr.onStatus = function(opId, fileSize, percent, status) {
            if(status == 0) {
                appcan.window.openToast('正在更新软件版本，当前进度' + percent + '%', '', 5, 1);
            }else if(status ==1) {
                appcan.window.closeToast();
                uexDownloaderMgr.closeDownloader('14');  //关闭下载
                uexWidget.installApp('/sdcard/zwbst.apk');  //安装下载文件
            }else {
                alert('下载出错了');
            }
        };
    
        //第六步：创建下载对象的回调函数
        uexDownloaderMgr.cbCreateDownloader = function(opId, dataType, data) {
            var updateUrl = androidURL;
            uexDownloaderMgr.download('14', updateUrl, '/sdcard/zwbst.apk/', 0);  //开始下载
            
        };
    
        //第五步：confirm对话框的回调方法
        uexWindow.cbConfirm = function(opId, dataType, data) {
            if(data == 1) {
                //确认更新
                uexDownloaderMgr.createDownloader("14");
            }
        };
    
        //第四步：调用检查更新回调函数
        uexWidget.cbCheckUpdate = function(opCode, dataType, jsonData) {  //jsonData:检查结果json格式
            app.checkVersion();
        };
        
        
        //第三步：检查是否存在sd卡的回调函数
        uexFileMgr.cbIsFileExistByPath = function() {
            uexWidget.checkUpdate();
        };
        
        //第二步：获取平台信息的回调函数，确定客户端的平台类型
        uexWidgetOne.cbGetPlatform = function(opId, dataType, data) {
            if(data == 0) {
                //苹果机型,直接调用检查更新，地址在config.xml里配置
                uexWidget.checkUpdate();
            }else if(data == 1){
                //安卓机型，判断是否存在sd卡，再调用checkUpdate进行更新
                uexFileMgr.isFileExistByPath('/sdcard/');
            }else {
                //其它平台
            }
        };
        
        //第一步：获取平台信息
        uexWidgetOne.getPlatform();  
    },
};
