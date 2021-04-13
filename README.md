# 盟主直播 JS-SDK
![npm version](https://img.shields.io/badge/npm-1.0.0-green.svg)

盟主直播js-sdk，实现在网页中观看视频，与其它用户消息互动。SDK的目录在 src\utils 下。

下载本工程后，请先执行npm install命令。

## 引用方式

使用引用标签方式引入js-sdk
```javascript
    <link rel="stylesheet" href="utils/mzsdk.css">
    <script type="text/javascript" src="utils/mzsdk.js"></script>
```

使用ES6语法引入js-sdk（VUE单文件也使用这种方式直接引入）
```javascript
import mzsdk from 'utils/mzsdk';
import 'utils/mzsdk.css';
```

## JS-SDK - API

名称|参数|描述
--|--|--
checkPlayPermission|[Object]|检查用户是否有该活动的观看权限(目前支持白名单和F码权限)，传入参数{ticketId:活动编号, uniqueId:"用户id", name:"用户昵称", avatar:"用户头像", phone:"用户手机号", permission:{ id: 授权编号, key: 授权密钥 }, isShowLog:"是否打印log，方便调试"}
init|[Object]|初始化直播sdk，传入参数{ticketId:活动编号, uniqueId:"用户id", name:"用户昵称", avatar:"用户头像", phone:"用户手机号", permission:{ id: 授权编号, key: 授权密钥 }, isShowLog:"是否打印log，方便调试"}
connect|-|sdk初始化完成后，调用此方法，连接到当前直播会话中，与其它用户互动。
disconnect|-|断开连接，当用户退出时，调用此方法，结束直播会话。
getOnlines|[Object]|获取在线观众列表, 传入参数{ticketId:活动编号}
getHostInfo|[Object]|获取主播信息, 传入参数{ticketId:活动编号}
getWebinarToolsList|[Object]|获取活动的详细配置信息, 传入参数{ticketId:活动编号}
useFCode|[Object]|若活动需要F码权限观看，调用使用F码, 传入参数{ticketId:活动编号, fCode:F码}

### 示例
```javascript
mzsdk.init({
    //盟主活动ID
    ticketId: "",
    //用户唯一ID
    uniqueId: '',
    //用户昵称
    name: "",
    //用户头像
    avatar:"",
    //用户手机号
    phone:""
    //盟主JS-SDK授权信息
    permision: {
        id: "",
        key: ""
    },
    //是否打印log
    isShowLog: true
}).then((res) => {
    console.log("返回的播放信息,包含活动的配置信息", res);

    //创建链接
    mzsdk.connect();

    //TODO:初始化完成后，在这里完成其它操作。
});
```

## 视频组件（mzsdk.player）

名称|参数|描述
--|--|--
init|[Object]|初始化视频组件
render|-|渲染播放器
dispose|-|销毁播放器，生命周期销毁的时候记得销毁播放器

### init方法参数说明

名称|类型|描述
--|--|--
domId|String|播放器父元素id，最好用div等块级元素。

### 视频组件的播放相关事件

名称|描述
--|--
onReady|播放器控件准备完毕
onPlay|开始播放
onPause|回放时使用，暂停播放事件
onEnd|回放时使用，结束播放事件
onWaiting|播放过程中由于网络或其他原因产生的等待，此时视频播放暂停，等网络恢复后会自动播放
onFirstPlay|第一次播放
onDurationChange|视频总时长发生改变
onFullScreenChange|全屏改变
onLoadedAllData|已加载完毕所有的媒体数据
onLoadedData|已加载完毕当前播放位置的媒体数据，准备播放
onLoadStart|开始请求数据
onLoadedMetaData|获取资源完成
onCanPlayThrough|视频源数据加载完成
onPlaying|视频播放中
onError|视频播放各种错误
onSeeking|视频跳转中
onSeeked|视频跳转结束
onRateChange|播放速率改变
onTimeUpdate|播放时长改变
onVolumeChange|音量改变
onStalled|网速异常


### 视频组件的活动相关事件

名称|描述
--|--
onOver|主播离开事件
onLiveEnd|直播时使用，直播结束事件
onOnline|上线了一个用户
onOffline|下线了一个用户
onCMD|活动各种cmd事件，包括开始直播，禁言，被踢出，活动各种配置开关等，具体可参考demo


### 示例
```javascript
mzsdk.init({
    //...
}).then(() => {
//创建链接
//创建链接
    mzsdk.connect();
    //初始化播放器
    mzsdk.player.init({
        domId: "mz-video-wrapper",
        // 播放事件
        onReady: function () {
            console.log("播放器控件准备完毕");
        },
        onPlay: function (e) {
            console.log("开始播放", e);
        },
        onPause: function (e) {
            console.log("暂停播放", e);
        },
        onEnd: function (e) {
            console.log("结束播放", e);
        },
        onWaiting: function (e) {
            console.log("播放过程中由于网络或其他原因产生的等待，此时视频播放暂停，等网络恢复后会自动播放", e);
        },
        onFirstPlay: function (e) {
            console.log("第一次播放", e);
        },
        onDurationChange: function (e) {
            console.log("视频总时长发生改变", e);
        },
        onFullScreenChange: function (e) {
            console.log("全屏改变", e);
        },
        onLoadedAllData: function (e) {
            console.log("已加载完毕所有的媒体数据", e);
        },
        onLoadedData: function (e) {
            console.log("已加载完毕当前播放位置的媒体数据，准备播放", e);
        },
        onLoadStart: function (e) {
            console.log("开始请求数据", e);
        },
        onLoadedMetaData: function (e) {
            console.log("获取资源完成", e);
        },
        onCanPlayThrough: function (e) {
            console.log("视频源数据加载完成", e);
        },
        onPlaying: function (e) {
            console.log("视频播放中", e);
        },
        onError: function (e) {
            if (e.code == -499) {
                if (_this.state.ticketInfo.status == 0) {
                    console.log("视频加载错误原因为：未开播")
                    window.alert('活动未开播');
                } else if (_this.state.ticketInfo.status == 3) {
                    console.log("视频加载错误原因为：断流中")
                    window.alert('活动断流中');
                } else {
                    console.log("视频加载错误原因为：空资源")
                }
            } else {
                console.log("视频加载错误", e);
            }
        },
        onSeeking: function (e) {
            console.log("视频跳转中", e);
        },
        onSeeked: function (e) {
            console.log("视频跳转结束", e);
        },
        onRateChange: function (e) {
            console.log("播放速率改变", e);
        },
        onTimeUpdate: function (e) {
            // console.log("播放时长改变", e);
        },
        onVolumeChange: function (e) {
            console.log("音量改变", e);
        },
        onStalled: function (e) {
            console.log("网速异常", e);
        },

        // 活动事件
        onOver: function () {
            console.log("主播离开");
            window.alert('主播暂时离开')
        },
        onLiveEnd: function () {
            console.log("结束直播");
        },
        onOnline: function (msg) {
            console.log("上线了一个用户:", msg.data);
        },
        onOffline: function (msg) {
            console.log("下线了一个用户:", msg.data);
        },
        onCMD: function (msg) {
            console.log("接收到其他消息：", msg);
            const res = msg;
            switch (res.data.type) {
                case "*channelStart":
                    console.log("*确认：频道有新的直播开始了,判断新开始的直播是否是本直播,可以做一些特殊处理");
                    // if (res.data.ticket_id == ticketId) {

                    // }
                    break;
                case "*publishStart":
                    console.log("*确认：开始直播");
                    localStorage.setItem("ticketId", ticketId)
                    setTimeout(() => {//3秒后刷新本页面
                        location.reload();
                    }, 3000);
                    break;
                case "*disablechat":
                    console.log("*确认：禁言")
                    break;
                case "*permitchat":
                    console.log("*确认：解禁")
                    break;
                case "*webinarViewConfigUpdate": //活动配置更改
                    for (const aObject in res.data.webinar_content) {
                        if (res.data.webinar_content.hasOwnProperty(aObject)) {
                            const element = res.data.webinar_content[aObject];
                            switch (element.type) {
                                case "hide_chat_history": //历史记录隐藏的开关
                                    console.log("历史记录隐藏的开关:", element.is_open);
                                    break;
                                case "disable_chat": //全体禁言开关
                                    console.log("全体禁言开关:", element.is_open);
                                    break;
                                case "barrage": //弹幕开关
                                    console.log("弹幕开关:", element.is_open);
                                    break;
                                case "record_screen": //防录屏开关
                                    console.log("防录屏开关:", element.is_open);
                                    break;
                                case "vote": //投票开关
                                    console.log("投票开关:", element.is_open);
                                    break;
                                case "sign": //签到开关
                                    console.log("签到开关:", element.is_open);
                                    break;
                                case "documents": //文档开关
                                    console.log("文档开关:", element.is_open);
                                    break;
                                case "prize": //抽奖开关
                                    console.log("抽奖开关:", element.is_open);
                                    break;
                                case "full_screen": //暖场图开关
                                    console.log("暖场图开关:", element.is_open);
                                    break;
                                case "open_like": //点赞视图开关
                                    console.log("点赞视图开关:", element.is_open);
                                    break;
                                case "pay_gift": //礼物视图开关
                                    console.log("礼物视图开关:", element.is_open);
                                    break;
                                case "times_speed": //倍速视图开关
                                    console.log("倍速视图开关:", element.is_open);
                                    break;
                                default:
                                    console.log("未处理的活动配置开关：", res.data.type);
                                    break;
                            }
                        }
                    }
                    break;
                case "*kickout": //收到一条踢出用户的消息
                    console.log("用户 ", res.data.user_id, " 被踢出");
                    break;
                case "*answerNewReplyMsg":
                    console.log("问答：我的提问有一条新的回复，目前未读个数为 ", res.data.count);
                    break;
                default:
                    console.log("未处理的cmd命令： ", res.data.type);
                    break;
            }

        }
    //渲染播放器
    mzsdk.player.render();
    //其它操作...
});
```

## 聊天组件（mzsdk.chat)

方法名称|参数|描述
--|--|--
init|[Object]|初始化聊天组件
push|String|发送聊天消息
getHistoryList|-|获取历史消息列表，字段说明见示例

### 聊天组件事件列表

名称|参数|描述
--|--|--
receiveMsg|[Object]|接收聊天消息，字段说明见示例

### 示例
```javascript

mzsdk.init({
    //...
}).then(() => {
    //创建链接
    mzsdk.connect();
    //其它操作...
    //聊天组件初始化
    mzsdk.chat.init({
        //接收最新消息事件
        receiveMsg: (msg) => {
            console.log("用户昵称：", msg.userName);
            console.log("发送时间：", msg.time);
            console.log("消息内容：", msg.text);
            console.log("用户头像：", msg.avatar);
            console.log("用户ID：", msg.uniqueID);
        }
    });
    //发送消息方法
    mzsdk.chat.push("我先发一条消息");

    //获取历史消息方法
    mzsdk.chat.getHistoryList().then(({data}) => {
        data.map(item => {
            console.log("用户昵称：", item.userName);
            console.log("发送时间：", item.time);
            console.log("消息内容：", item.text);
            console.log("用户头像：", msg.avatar);
            console.log("用户ID：", msg.uniqueID);
        });
    });
    //其它操作...
});
```

## 文档组件（mzsdk.doc）

方法名称|参数|描述
--|--|--
init|[Object]|初始化文档组件
getFileList|-|获取活动关联的文件列表
getFileInfo|FileId|根据文件id获取文件信息，返回值为图片数组

### 文档组件事件列表

名称|参数|描述
--|--|--
onChange|[Object]|直播时使用，改变当前文档。字段说明见示例

### 示例
```javascript

mzsdk.init({
    //...
}).then(() => {
    //创建链接
    mzsdk.connect();
    //其它操作...
    //初始化文档
    mzsdk.doc.init({
        //直播时，切换下一张文档
        onChange: (data) => {
            console.log("切换文档，当前文档页图片地址：", data.access_url);
        }
    });
    //获取文件列表
    mzsdk.doc.getFileList().then(data => {
        data.map(item => {
            console.log("文件ID：",item.id, "文件名称：", item.file_name);
        });
    });
    //根据文件ID，获取文件信息
    mzsdk.doc.getFileInfo(183).then(data => {
        console.log("获取文件信息：", data);
    });
    //其它操作...
});
```
