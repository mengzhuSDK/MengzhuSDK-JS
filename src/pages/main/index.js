import React from 'react';
import './index.css';
import mzsdk from '../../utils/mzsdk';
import '../../utils/mzsdk.css';

import ChatList from './components/ChatList';
import FCodeAlert from './components/FCodeAlert';
import WhiteAlert from './components/WhiteAlert';
import GetKickoutAlert from './components/GetKickoutAlert';

import { isMobile } from "common/common";
import Toast from 'components/Toast';

// 设置 盟主SDK 分配的 APPID 和 APPKEY
let id = "";
let key = "";
let isShowLog = false;

// 用户信息
let uniqueId = 'mengzhu_xiaomengxin';
let name = "盟主小萌新";
let avatar = "http://s1.dev.zmengzhu.com/upload/img/5b/c6/5bc6401a483360737cc6ca24f5bdc960.jpeg";
let phone = "19912344322";

// 活动ID
let ticketId = "";

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        ticketId = props.match.params.ticketId;
        this.state = {
            chatList: [],
            currentPic: "",
            ticketInfo: null,

            isShowErrorDisplay: false,//播放展示错误的展示
            errorContent: '',//错误内容

            isBannedAll: false,//是否禁止所有人聊天
            isBannedMeTalk: false,//是否禁言自己
            chatListRef: null,

            isShowFCodeAlert: false,//输入F码弹窗
            isShowWhiteAlert: false,//白名单无权限观看弹窗
            isShowGetKickoutAlert: false,//被踢出房间弹窗

            activityKey: 'chat',//当前展示的菜单的key
        };
    }

    componentWillUnmount() {
        if (mzsdk) {//销毁mzsdk
            mzsdk.disconnect();
        }
    }
    componentDidMount() {
        var _this = this;
        var ticket = localStorage.getItem('ticketId');
        if (ticket) {
            localStorage.removeItem('ticketId');
            ticketId = ticket;
            // 去检查活动观看权限
            this.checkTicketPlayPermission();
            return;
        }
        if (ticketId.length <= 0) {
            Toast.show('活动ID不能为空', 'error');
            setTimeout(() => {
                _this.props.history.push('/home');
            }, 0);
            return;
        }
        this.checkTicketPlayPermission();

        if (isMobile() == false) {
            window.onresize = function () {
                let height = (((window.innerWidth * 0.5) / 16) * 9).toFixed(3);
                let videoWrapper = document.getElementById("mz-video-wrapper");
                if (videoWrapper !== null && videoWrapper !== undefined) {
                    videoWrapper.style.height = height + 'px';
                    videoWrapper.style.width = '50%';
                }
            };
        } else {
            // 这里可以监听safari浏览器动态更改各个地方的高度

            // window.addEventListener('resize', function () {
            //     let tabBackgroundDiv = document.getElementById("tab-background");
            //     if (tabBackgroundDiv !== null && tabBackgroundDiv !== undefined) {
            //         tabBackgroundDiv.style.height = "calc(" + window_height + " - 4.22rem)";
            //     }
            // })
        }
    }

    createChatListRef = (ref) => {
        this.state.chatListRef = ref;
    }

    checkTicketPlayPermission = () => {
        var _this = this;

        // 检测活动的观看权限
        mzsdk.checkPlayPermission({
            ticketId: ticketId,
            uniqueId: uniqueId,
            name: name,
            avatar: avatar,
            phone: phone,
            permision: {
                id: id,
                key: key
            },
            isShowLog: isShowLog
        }).then((res) => {
            console.log("res:", res);

            // "view_mode": 6, // 视频观看模式 1:免费 2:vip 3:付费 4:密码  5:白名单观看 6:F码观看
            // "allow_play": 1 // 是否有权限观看 0:否 1:是
            if (res.allow_play == 1) {
                _this.initMzSDK();
                return;
            }

            if (res.view_mode == 5) {
                this.setState({
                    isShowWhiteAlert: true
                })
            } else if (res.view_mode == 6) {
                this.setState({
                    isShowFCodeAlert: true
                })
            } else {
                _this.initMzSDK();
            }
        }, (error) => {
            console.log("error:", error);
            Toast.show(error.msg, 'error');
            this.props.history.push('/main');
        })
    }

    initMzSDK = () => {
        var _this = this;
        mzsdk.init({
            ticketId: ticketId,
            uniqueId: uniqueId,
            name: name,
            avatar: avatar,
            phone: phone,
            permision: {
                id: id,
                key: key
            },
            isShowLog: isShowLog

        }).then((res) => {
            console.log("返回的播放信息：", res);

            /* 播放信息
            channel_id; // 频道ID
            chat_uid; // 自己在聊天室里的id
            cover; // 活动封面
            status; // 直播状态 0:未开播 1:直播 2:回放 3:断流
            live_type; // 直播类型 0:视频 1:语音
            popular; // 活动pv
            msg_config; // 消息监听配置
            chat_config; // 聊天监听配置
            like_num; // 用户点赞数量
            live_style; // 直播样式 0:横屏 1:竖屏
            unique_id;//第三方传递过来的唯一id
            view_mode;// 观看权限 1:免费 2:vip 3:付费 4:密码  5:白名单观看 6:F码观看
            ticket_id;//活动ID
            user_status;// 用户状态 1:正常 2:被踢出 3:禁言
            notice: {Object} // 公告内容
            video: {Object} // 视频播放地址
            uv; // uv
            webinar_onlines; // 进入频道的时候的总在线人数
            right: [] // 活动配置
            */

            for (let i = 0; i < res.right.length; i++) {
                let element = res.right[i];
                if (element.type == 'disable_chat') {
                    if (parseInt(element.is_open) == 1) {
                        _this.state.isBannedAll = true
                    }
                    break
                }
            }

            if (res.user_status && parseInt(res.user_status) == 2) {
                this.setState({
                    isShowGetKickoutAlert: true
                })
                return;
            }

            if (res.user_status && parseInt(res.user_status) == 3) {
                this.setState({
                    isBannedMeTalk: true
                })
                Toast.show('您已被禁言', 'error')
            }

            _this.setState({
                ticketInfo: res
            })

            //创建链接
            mzsdk.connect();

            // //发送消息
            // mzsdk.chat.push("我先发一条消息");
            mzsdk.chat.init({
                receiveMsg: (msg) => {
                    console.log("收到一条消息:", msg)
                    let { chatList } = _this.state;
                    chatList.push({
                        userName: msg.userName,
                        time: msg.time,
                        text: msg.text,
                        avatar: msg.avatar,
                        uniqueID: msg.uniqueID
                    });
                    if (this.state.chatListRef) {
                        this.state.chatListRef.updateList();
                    }
                }
            });
            //获取历史消息
            mzsdk.chat.getHistoryList().then(data => {

                let { chatList } = _this.state;

                _this.setState({
                    chatList: chatList.concat(data)
                })
            });

            //初始化文档
            mzsdk.doc.init({
                //直播时，切换下一张文档
                onChange: (data) => {
                    _this.setState({
                        currentPic: data.access_url
                    });
                }
            });
            //获取文件列表
            mzsdk.doc.getFileList().then(data => {
                console.log("获取文件列表：", data);

                if (data && data.length > 0) {
                    //获取文件信息
                    mzsdk.doc.getFileInfo(data[0].id).then(data => {
                        console.log("获取文件信息：", data);
                    }, (error) => {
                        console.log("获取文件信息失败：", error);
                    });
                }
            }, (error) => {
                console.log("获取文件列表失败：", error);
            });

            //获取问答列表
            var discussParam = {
                ticketId: ticketId,//活动ID
                isNewReply: 0,//是否查询有未读的回复， 0-不查询 1-查询
                offset: 0,//偏移,当前已经返回的数据总个数
                limit: 10//请求返回的列表个数
            }
            mzsdk.getDiscussList(discussParam).then(function (res) {
                console.log("问答模块获取问题列表结果：", res);
            }, function (error) {
                console.log("问答模块获取问题列表结果失败：", error);
            })

            if (res.status == 0) {
                this.setState({
                    errorContent: '未开播',
                    isShowErrorDisplay: true,
                })
            } else if (res.status == 3) {
                this.setState({
                    errorContent: '断流中',
                    isShowErrorDisplay: true,
                })
            } else {
                this.setState({
                    errorContent: '',
                    isShowErrorDisplay: false,
                })
            }

            //初始化播放器
            mzsdk.player.init({
                domId: "mz-video-wrapper",
                // 播放事件
                onReady: function () {
                    console.log("播放器控件准备完毕");
                    // document.querySelector("video").play();
                    document.querySelector("video").pause();
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
                            Toast.show('活动未开播', 'error');
                        } else if (_this.state.ticketInfo.status == 3) {
                            console.log("视频加载错误原因为：断流中")
                            Toast.show('活动断流中', 'error');
                        } else {
                            console.log("视频加载错误原因为：空资源")
                        }
                    } else {
                        // Toast.show(e.target.player.error_.message, 'error');
                        console.log("视频加载错误：", e.target.player.error_.message);
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
                    console.log("主播暂时离开");
                    _this.setState({
                        errorContent: '断流中',
                        isShowErrorDisplay: true,
                    })
                },
                onLiveEnd: function () {
                    console.log("结束直播");
                    setTimeout(() => {//1秒后刷新本页面
                        location.reload();
                    }, 1000);
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
                            console.log("*确认：禁言", res.data.user_id)
                            if (res.data.user_id == _this.state.ticketInfo.chat_uid) {
                                Toast.show('您已被禁言', 'error')
                                _this.setState({
                                    isBannedMeTalk: true
                                })
                            }
                            break;
                        case "*permitchat":
                            console.log("*确认：解禁", res.data.user_id)
                            if (res.data.user_id == _this.state.ticketInfo.chat_uid) {
                                Toast.show('您已解除禁言', 'success')
                                _this.setState({
                                    isBannedMeTalk: false
                                })
                            }
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
                                            let bannedAll = false;
                                            if (parseInt(element.is_open) == 1) {
                                                bannedAll = true;
                                            }
                                            _this.state.isBannedAll = bannedAll;
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
                            if (res.data.user_id == _this.state.ticketInfo.chat_uid) {
                                _this.setState({
                                    isShowGetKickoutAlert: true
                                })
                            }
                            break;
                        case "*answerNewReplyMsg":
                            console.log("问答：我的提问有一条新的回复，目前未读个数为 ", res.data.count);
                            break;
                        case "*answerNewMsg": //有一新的问题（包括自己发的问题）
                            console.log("问答：收到一新问题, 我自己提出的问题一共有：", res.data.count);
                            break;
                        default:
                            console.log("未处理的cmd命令： ", res.data.type);
                            break;
                    }

                }
                // onRestart: function () {
                //     mzsdk.player.render();
                // }
            });
            mzsdk.player.setHideDefaultErrorDisplay();
            mzsdk.player.render();

            _this.getHostInfo();

        }, (error) => {
            console.log("error:", error);
            Toast.show(error.msg, 'error')
            this.props.history.push('/main');
        });
    }

    // 发送消息
    btnSend = () => {
        if (this.input.value.trim().length <= 0) {
            return;
        }
        if (this.state.isBannedAll) {
            Toast.show('主播开启了全体禁言', 'error')
            return;
        }
        if (this.state.isBannedMeTalk) {
            Toast.show('您已被禁言', 'error')
            return;
        }
        mzsdk.chat.push(this.input.value);

        // var _this = this;
        // // 提交问题
        // var discussParam = {
        //     ticketId: ticketId,//活动ID
        //     content: _this.input.value,//提问的问题，不能为空
        //     isAnonymous: '0'//是否匿名提问？ 0-否 1-是,必须字符串
        // }
        // console.log("提交问答的参数：", discussParam);
        // mzsdk.submitDiscussQuestion(discussParam).then(function (res) {
        //     console.log("问答模块提交问题结果：", res);
        // }, function (error) {
        //     console.log("问答模块提交问题结果失败：", error);
        // })

        this.input.value = "";
    }

    // 获取在线观众列表
    getOnlines = () => {
        var data = {
            ticketId: ticketId
        }
        mzsdk.getOnlines(data).then((res) => {
            console.log("获取在线观众列表成功:", res);
        }, (error) => {
            console.log("获取在线观众列表失败:", error);
        })
    }

    //获取活动的所有开关配置
    getWebinarToolsList = () => {
        var data = {
            ticketId: ticketId
        }
        mzsdk.getWebinarToolsList(data).then(function (res) {
            console.log("返回活动所有开关配置：", res);
        }, function (err) {
            console.log("获取活动所有配置接口请求错误: ", err);
        })
    }

    // 获取主播信息
    getHostInfo = () => {
        var _this = this;
        var data = {
            ticketId: ticketId
        }

        mzsdk.getHostInfo(data).then(function (res) {
            console.log("获取主播信息接口返回成功：", res);
        }, function (error) {
            console.log("获取主播信息接口失败：", res);
        })
    }

    // 标题选择
    changeActiveKey = (key) => {
        console.log("点击了:", key);
        this.setState({
            activityKey: key
        })
    }

    dialogHandle = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
        this.props.history.push('/home');
    }
    addCallBack = () => {
        this.setState({
            isShowFCodeAlert: false
        })
        this.initMzSDK();
    }
    render() {
        let { chatList, currentPic, ticketInfo, isShowFCodeAlert, isShowWhiteAlert, isShowGetKickoutAlert, isBannedMeTalk, isShowErrorDisplay, errorContent, activityKey } = this.state;
        let window_height = window.innerHeight + 'px';
        return (
            <div className="main-wrapper" style={{ minWidth: isMobile() ? '0rem' : '640px' }}>
                <div className="main-top" style={{ flexDirection: isMobile() ? 'column' : 'row' }}>
                    {
                        isShowErrorDisplay ?
                            <div className={isMobile() ? 'main-top-video' : 'main-left'}>
                                <img className="errorImage" width="100%" height="100%" src={ticketInfo ? ticketInfo.cover : ''} />
                                <div className="errorContent">{errorContent}</div>
                            </div> : (
                                isMobile() ?
                                    <div className={'main-top-video'} id="mz-video-wrapper" />
                                    :
                                    <div className={'main-left'} id="mz-video-wrapper" />
                            )
                    }
                    {
                        isMobile() ? (
                            <div id="tab-background" style={{ height: "calc(" + window_height + " - 4.22rem)" }} >
                                <div className="tab-menu-background">
                                    <div className={activityKey == 'chat' ? 'tab-menu-item activity' : 'tab-menu-item'} onClick={() => { this.changeActiveKey('chat') }}>互动</div>
                                    <div className={activityKey == 'doc' ? 'tab-menu-item activity' : 'tab-menu-item'} onClick={() => { this.changeActiveKey('doc') }}>文档</div>
                                </div>
                                <div className="tab-content-background">
                                    <div className={activityKey == 'chat' ? 'tab-content-item' : 'tab-content-item none'}>
                                        <div style={{ display: 'flex', flexDirection: 'column-reverse', flex: '1', width: '100vw' }}>
                                            <div className='mobile-main-chat-send-wrapper'>
                                                <textarea className='mobile-main-chat-send-cont' ref={node => this.input = node} />
                                                <span className='mobile-btn-send' onClick={this.btnSend}>发送</span>
                                            </div>
                                            <div className="main-chat-content">
                                                <ChatList onRef={this.createChatListRef} list={chatList} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={activityKey == 'doc' ? 'tab-content-item' : 'tab-content-item none'}>
                                        {
                                            currentPic ?
                                                <img style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} src={currentPic || ""} /> :
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>暂无文档</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column-reverse', flex: '1', minHeight: '454px' }}>
                                <div className='main-chat-send-wrapper'>
                                    <textarea className='main-chat-send-cont' ref={node => this.input = node} />
                                    <span className='btn-send' onClick={this.btnSend}>发送</span>
                                </div>
                                <div className="main-chat-content">
                                    <ChatList onRef={this.createChatListRef} list={chatList} />
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    isMobile() == false &&
                    <div className="main-bottom">
                        <img className="main-doc-img" src={currentPic || ""} />
                    </div>
                }
                {
                    isShowFCodeAlert &&
                    <FCodeAlert
                        ticketId={ticketId}
                        dialogHandle={() => this.dialogHandle("isShowFCodeAlert")}
                        addCallBack={() => this.addCallBack()}
                    >
                    </FCodeAlert>
                }
                {
                    isShowWhiteAlert &&
                    <WhiteAlert
                        dialogHandle={() => this.dialogHandle("isShowWhiteAlert")}
                    >
                    </WhiteAlert>
                }
                {
                    isShowGetKickoutAlert &&
                    <GetKickoutAlert
                        dialogHandle={() => this.dialogHandle("isShowGetKickoutAlert")}
                    >
                    </GetKickoutAlert>
                }
            </div>
        );
    }
}