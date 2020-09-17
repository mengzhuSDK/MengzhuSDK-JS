import React from 'react';
import './index.css';
import mzsdk from '../../utils/mzsdk';
import '../../utils/mzsdk.css';
import ChatList from './components/ChatList';

export default class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chatList: [],
            currentPic: ""
        }
    }

    componentDidMount() {
        mzsdk.init({
            ticketId: "填入活动ID",
            uniqueId: '填入用户ID',
            name: "填入用户昵称",
            avatar:"填入用户头像",
            permision: {
                id: "填入Appid",
                key: "填入App Secret"
            }
        }).then(() => {
            //创建链接
            mzsdk.connect();
            //初始化播放器
            mzsdk.player.init({
                domId: "mz-video-wrapper",
                onPlay: function() {
                    console.log("开始播放");
                },
                onPause: function() {
                    console.log("暂停播放");
                },
                onEnd: function() {
                    console.log("结束播放");
                },
                onOver: function() {
                    console.log("主播离开");
                },
                onLiveEnd: function() {
                    console.log("结束直播");
                },
                onRestart: function() {
                    mzsdk.player.render();
                }
            });
            mzsdk.player.render();
            
            // //发送消息
            // mzsdk.chat.push("我先发一条消息");
            mzsdk.chat.init({
                receiveMsg: (msg) => {
                    let { chatList } = this.state;
                    chatList.push({
                        userName: msg.userName,
                        time: msg.time,
                        text: msg.text
                    });
                    this.forceUpdate();
                }
            });
            //获取历史消息
            mzsdk.chat.getHistoryList().then(data => {

                let { chatList } = this.state;

                this.setState({
                    chatList: chatList.concat(data)
                })
            });

            //初始化文档
            mzsdk.doc.init({
                //直播时，切换下一张文档
                onChange: (data) => {
                    this.setState({
                        currentPic: data.access_url
                    });
                }
            });
            //获取文件列表
            mzsdk.doc.getFileList().then(data => {
                console.log("获取文件列表：", data);
            });
            //获取文件信息
            mzsdk.doc.getFileInfo(183).then(data => {
                console.log("获取文件信息：", data);
            });
        });
    }

    btnSend = () => {
        if(this.input.value.trim().length <= 0) {
            return;
        }
        mzsdk.chat.push(this.input.value);
        this.input.value = "";
    }
    
    render() {
        let { chatList, currentPic } = this.state;
        return (<div className="main-wrapper">
            <div className="main-top">
                <div className="main-left" id="mz-video-wrapper"></div>
                <div className="main-right">
                    <div className="main-chat-content">
                        <ChatList list={chatList} />
                    </div>
                    <div className="main-chat-send-wrapper">
                        <textarea className="main-chat-send-cont" ref={node => this.input = node} />
                        <span className="btn-send" onClick={this.btnSend}>发送</span>
                    </div>
                </div>
            </div>
            <div className="main-bottom">
                <img className="main-doc-img" src={currentPic || ""}/>
            </div>
        </div>);
    }
}