import React from 'react';
import './index.css';
import mzsdk from '../../utils/mzsdk';
import '../../utils/mzsdk.css';

import FCodeAlert from './components/FCodeAlert';
import WhiteAlert from './components/WhiteAlert';
import GetKickoutAlert from './components/GetKickoutAlert';

import PCPlayer from './playerUI/pc';
import SuperPlayer from './playerUI/super';
import VerticalPlayer from './playerUI/vertical';

import { isMobile } from "common/common";
import Toast from 'components/Toast';

import FullScreenAd from './components/FullScreenAd';

let id = "2020112009273825614";
let key = "hL8nRlUtxoE5V42wpw7Bocp5pA8EEPcI5fow3qreuVPt19pQ31xD8rzLUTeeuKqu";
let isShowLog = false;

// 用户信息
let uniqueId = 'mengzhu_xiaomengxin';
let name = "盟主小萌新";
let avatar = "http://s1.dev.zmengzhu.com/upload/img/5b/c6/5bc6401a483360737cc6ca24f5bdc960.jpeg";
let phone = "19912344322";

// 活动ID
let ticketId = "";

let isPageHide = false;

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

            isShowDisableRecordScreen: false,//是否显示防录屏
            isShowFullScreenAd: false,//是否显示暖场图

            hostInfo: null,//主播信息

            live_style: -1,// -1=加载中，0=横屏播放器，1=竖屏播放器

            superPlayerRef: null,//二分屏播放器Ref
            verticalplayerRef: null,//竖屏播放器Ref
        };
    }

    componentWillUnmount() {
        if (mzsdk) {//销毁mzsdk
            mzsdk.disconnect();
        }
    }
    componentDidMount() {
        window.addEventListener('pageshow', function () {
            if (isPageHide) {
                window.location.reload();
            }
        });
        window.addEventListener('pagehide', function () {
            isPageHide = true;
        });

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

            let isShowFSAd = false;

            for (let i = 0; i < res.right.length; i++) {
                let element = res.right[i];
                switch (element.type) {
                    case 'disable_chat'://全体禁言开关配置
                        if (parseInt(element.is_open) == 1) {
                            _this.state.isBannedAll = true
                        }
                        break;
                    case 'record_screen'://防录屏开关
                        if (parseInt(element.is_open) == 1) {
                            _this.state.isShowDisableRecordScreen = true
                        }
                        break;
                    case 'full_screen'://启动广告开关（暖场图）
                        if (parseInt(element.is_open) == 1 && isMobile()) {
                            isShowFSAd = true
                        }
                        break;
                    default:
                        break;
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

            if (isShowFSAd) {
                _this.setState({
                    isShowFullScreenAd: true
                }, () => {
                    setTimeout(() => {
                        _this.setState({
                            ticketInfo: res,
                            live_style: res.live_style
                        }, () => {
                            _this.initPlayer();
                        })
                    }, 1000);
                })
            } else {
                _this.setState({
                    ticketInfo: res,
                    live_style: res.live_style
                }, () => {
                    _this.initPlayer();
                })
            }

        }, (error) => {
            console.log("error:", error);
            Toast.show(error.msg, 'error')
            this.props.history.push('/main');
        });
    }

    // 初始化播放器的需求
    initPlayer = () => {
        var _this = this;

        let { ticketInfo } = this.state;
        let res = ticketInfo;

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
            console.log("获取历史记录：",data);
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
                if (e.target.player.isFullscreen_ == true) {
                    console.log("进入全屏");
                } else {
                    console.log("退出全屏，如果需要这里设置自动播放");
                    if (document.querySelector("video").paused) {
                        document.querySelector("video").play();
                    }
                }
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
                    } else if (_this.state.ticketInfo.status == 3) {
                        console.log("视频加载错误原因为：断流中")
                    } else {
                        console.log("视频加载错误原因为：空资源")
                    }
                } else {
                    console.log("视频异常中断：", e.target.player.error_.message);
                    _this.setState({
                        errorContent: '视频异常中断',
                        isShowErrorDisplay: true,
                    })
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
            onEnterPictureInPicture: function (e) {
                console.log("进入画中画");
            },
            onLeavePictureInPicture: function (e) {
                console.log("离开画中画， 如果需要这里设置自动播放");
                if (document.querySelector("video").paused) {
                    document.querySelector("video").play();
                }
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
                        setTimeout(() => {//15秒后刷新本页面
                            location.reload();
                        }, 15000);
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
                                        let isShowRecordScreen = false;
                                        if (parseInt(element.is_open) == 1) {
                                            isShowRecordScreen = true;
                                        }
                                        _this.state.isShowDisableRecordScreen = isShowRecordScreen;
                                        _this.fixDisableScreen();
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
        });
        mzsdk.player.setHideDefaultErrorDisplay();//隐藏默认的错误页面
        mzsdk.player.render();

        _this.getHostInfo();
    }

    // 获取二分屏播放器Ref
    getSuperPlayerRef = (ref) => {
        this.state.superPlayerRef = ref;
    }

    // 获取竖屏播放器Ref
    getVerticalPlayerRef = (ref) => {
        this.state.verticalplayerRef = ref;
    }

    // 发送消息
    btnSend = (inputRef) => {
        console.log("inputRef:", inputRef);
        if (!inputRef) {
            return;
        }
        if (inputRef.value.trim().length <= 0) {
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
        mzsdk.chat.push(inputRef.value);

        inputRef.value = "";
    }

    // 问答系统 - 提交问题
    submitDiscussQuestion = (question, isAnonymous) => {
        var discussParam = {
            ticketId: ticketId,//活动ID
            content: question,//提问的问题，不能为空
            isAnonymous: isAnonymous//是否匿名提问？ 0-否 1-是,必须字符串
        }
        console.log("提交问答的参数：", discussParam);
        mzsdk.submitDiscussQuestion(discussParam).then(function (res) {
            console.log("问答模块提交问题结果：", res);
        }, function (error) {
            console.log("问答模块提交问题结果失败：", error);
        })
    }

    // 问答系统 - 获取问答列表
    getDiscussQuestionList = () => {
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

    // 处理防录屏
    fixDisableScreen = () => {
        if (this.state.superPlayerRef) {
            if (this.state.isShowDisableRecordScreen) {
                this.state.superPlayerRef.startDisableRecordScreenDiv(this.state.hostInfo ? this.state.hostInfo.nickname : '');
            } else {
                this.state.superPlayerRef.endDisableRecordScreenDiv();
            }
        } else if (this.state.verticalplayerRef) {
            if (this.state.isShowDisableRecordScreen) {
                this.state.verticalplayerRef.startDisableRecordScreenDiv(this.state.hostInfo ? this.state.hostInfo.nickname : '');
            } else {
                this.state.verticalplayerRef.endDisableRecordScreenDiv();
            }
        }
    }

    // 获取主播信息
    getHostInfo = () => {
        var _this = this;
        var data = {
            ticketId: ticketId
        }

        mzsdk.getHostInfo(data).then(function (res) {
            console.log("获取主播信息接口返回成功：", res);
            _this.setState({
                hostInfo: res
            }, () => {
                _this.fixDisableScreen();
            })
        }, function (error) {
            console.log("获取主播信息接口失败：", error);
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
    videoBeforeAdEvent = (event, link) => {
        if (event == 'click' && link.length > 0) {
            window.open(link);
        }
        this.setState({
            isShowFullScreenAd: false
        })
    }
    render() {
        let { chatList, currentPic, ticketInfo, isShowFCodeAlert, isShowWhiteAlert, isShowGetKickoutAlert, isShowErrorDisplay, errorContent, live_style, isShowFullScreenAd, chatListRef, } = this.state;
        return (
            <div className="main-wrapper" style={{ minWidth: isMobile() ? '0rem' : '640px' }}>
                {
                    isMobile() ? (
                        live_style == 1 ?//竖屏播放器
                            <VerticalPlayer
                                isShowErrorDisplay={isShowErrorDisplay}
                                errorContent={errorContent}
                                ticketInfo={ticketInfo}
                                ticketId={ticketId}
                                chatList={chatList}
                                createChatListRef={this.createChatListRef}

                                btnSend={this.btnSend}
                                getRef={this.getVerticalPlayerRef}
                            >
                            </VerticalPlayer> : (
                                live_style == 0 ?//横屏播放器
                                    <SuperPlayer
                                        isShowErrorDisplay={isShowErrorDisplay}
                                        errorContent={errorContent}
                                        ticketInfo={ticketInfo}
                                        ticketId={ticketId}
                                        currentPic={currentPic}
                                        btnSend={this.btnSend}
                                        getRef={this.getSuperPlayerRef}

                                        chatList={chatList}
                                        createChatListRef={this.createChatListRef}
                                    >
                                    </SuperPlayer> : (
                                        isShowFullScreenAd == false &&
                                        <div style={{ background: 'white' }}>页面加载中...</div>
                                    )
                            )
                    ) :
                        <PCPlayer
                            isShowErrorDisplay={isShowErrorDisplay}
                            errorContent={errorContent}
                            ticketInfo={ticketInfo}
                            ticketId={ticketId}
                            currentPic={currentPic}
                            btnSend={this.btnSend}

                            chatList={chatList}
                            createChatListRef={this.createChatListRef}
                        >
                        </PCPlayer>

                }
                {
                    isShowFullScreenAd && <FullScreenAd
                        ticketId={ticketId}
                        event={this.videoBeforeAdEvent}
                    />
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