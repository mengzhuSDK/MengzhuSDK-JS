# 盟主直播 JS-SDK
![npm version](https://img.shields.io/badge/npm-1.0.0-green.svg)

盟主直播js-sdk，实现在网页中观看视频，与其它用户消息互动。

## 引用方式

使用引用标签方式引入js-sdk
```javascript
    <link rel="stylesheet" href="utils/mzsdk.css">
    <script type="text/javascript" src="utils/mzsdk.js"></script>
```

使用ES6语法引入js-sdk
```javascript
import mzsdk from 'utils/mzsdk';
import 'utils/mzsdk.css';
```
## 初始化JS-SDK

名称|参数|描述
--|--|--
init|[Object]|初始化直播sdk，传入参数{ticketId:活动编号, uniqueId:"用户id", name:"用户昵称", avatar:"用户头像", permission:{ id: 授权编号, key: 授权密钥 }}
connect|-|sdk初始化完成后，调用此方法，连接到当前直播会话中，与其它用户互动。
disconnect|-|断开连接，当用户退出时，调用此方法，结束直播会话。

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
    //盟主JS-SDK授权信息
    permision: {
        id: "",
        key: ""
    }
}).then(() => {
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

### init方法参数说明

名称|类型|描述
--|--|--
domId|String|播放器父元素id，最好用div等块级元素。

### 视频组件事件列表

名称|描述
--|--
onPlay|播放事件
onPause|回放时使用，暂停播放事件
onEnd|回放时使用，结束播放事件
onOver|直播时使用，主播离开事件
onRestart|直播时使用，主播回来事件
onLiveEnd|直播时使用，直播结束事件

### 示例
```javascript
mzsdk.init({
    //...
}).then(() => {
    //创建链接
    mzsdk.connect();
    //初始化播放器
    mzsdk.player.init({
        //指定播放器要渲染的位置
        domId: "mz-video-wrapper",
        //开始播放事件
        onPlay: function() {
            console.log("开始播放");
        },
        //暂停播放事件
        onPause: function() {
            console.log("暂停播放");
        },
        //结束播放事件
        onEnd: function() {
            console.log("结束播放");
        },
        //直播-主播离开事件
        onOver: function() {
            console.log("主播离开");
        },
        //直播-主播继续播放事件
        onRestart: function() {
            mzsdk.player.render();
        },
        //直播-直播结束事件
        onLiveEnd: function() {
            console.log("结束直播");
        }
    });
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