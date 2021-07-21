import React from 'react';
import "./index.css"
import "../player.css"
import ChatList from '../../components/ChatList';

import DisableRecordScreen from "../../components/DisableRecordScreen";
import RollingAd from '../../components/RollingAd';
import VideoAd from '../../components/VideoAd';

export default class SuperPlayer extends React.Component {
    /**
     * 二分屏播放器
     * 
     * @param {isShowErrorDisplay} props 是否显示错误信息
     * @param {errorContent} props 错误信息内容
     * @param {ticketInfo} props 当前活动信息
     * @param {ticketId} props 当前活动ID
     * @param {currentPic} props 当前文档图片
     * 
     * @param {btnSend} props 发送消息回调
     * @param {chatList} props 聊天消息列表
     * @param {createChatListRef} props 获取消息Ref
     * @param {getRef} props 返回自己的Ref
     */

    constructor(props) {
        super(props);
        this.state = ({
            activityKey: 'chat',//当前展示的菜单的key

            isShowRollingAd: false,//是否显示滚动广告（只支持文字广告和图片广告）
        })
    }

    // 标题选择
    changeActiveKey = (key) => {
        this.setState({
            activityKey: key
        })
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    onClickBtnSendButton = () => {
        this.props.btnSend(this.input)
    }

    // 获取防录屏的Ref
    getDisableRecordScreen = (ref) => {
        this.disableRecordScreenRef = ref;
    }

    // 开启防录屏
    startDisableRecordScreenDiv = (nickname) => {
        if (this.disableRecordScreenRef && this.props.isShowErrorDisplay == false) {
            let disableString = "防录屏文字";
            if (nickname && nickname.length > 0) {
                disableString = nickname;
            }
            this.disableRecordScreenRef.startDisableRecordScreenRef(disableString);
        }
    }

    // 关闭防录屏
    endDisableRecordScreenDiv = () => {
        if (this.disableRecordScreenRef && this.props.isShowErrorDisplay == false) {
            this.disableRecordScreenRef.endDisableRecordScreenRef();
        }
    }

    // 设置滚动视图是否显示
    setIsShow = (isShow) => {
        this.setState({
            isShowRollingAd: isShow
        })
    }

    // 点击滚动广告
    clickRollingAd = (link) => {
        if (link && link.length > 0) {
            window.open(link);
        }
    }

    render() {
        let { activityKey, isShowRollingAd } = this.state;
        let window_height = window.innerHeight + 'px';
        let rollingAdHeight = isShowRollingAd ? '1.6rem' : '0rem'
        return (
            <div className={this.props.ticketInfo && this.props.ticketInfo.status == 2 ? 'main-top-super' : 'main-top-super live-video-background'}>
                {
                    this.props.isShowErrorDisplay && this.props.isShowErrorDisplay == true ?
                        <div style={{ position: 'relative', height: '4.22rem' }}>
                            <div className={'main-top-video-super'}>
                                <img className="errorImage" width="100%" height="100%" src={this.props.ticketInfo ? this.props.ticketInfo.cover : ''} />
                                <div className="errorContent">{this.props.errorContent}</div>
                            </div>
                        </div> :
                        <div style={{ position: 'relative', height: '4.22rem' }} ref={ref => this.disableRecordScreenPartnerRef = ref}>
                            <div className={'main-top-video-super'} id="mz-video-wrapper" />
                            {
                                <DisableRecordScreen
                                    partnerRef={this.disableRecordScreenPartnerRef}
                                    getRef={this.getDisableRecordScreen}
                                >
                                </DisableRecordScreen>
                            }
                            {
                                <VideoAd
                                    type={1}
                                    ticketId={this.props.ticketId}
                                    poster={this.props.ticketInfo ? this.props.ticketInfo.cover : ''}
                                >
                                </VideoAd>
                            }
                        </div>
                }
                <RollingAd
                    ticketId={this.props.ticketId}
                    clickRollingAd={this.clickRollingAd}
                    isShow={this.setIsShow}
                >
                </RollingAd>
                <div id="tab-background" style={{ height: "calc(" + window_height + " - 4.22rem" + rollingAdHeight + ")" }} >
                    <div className="tab-menu-background">
                        <div className={activityKey == 'chat' ? 'tab-menu-item activity' : 'tab-menu-item'} onClick={() => { this.changeActiveKey('chat') }}>互动</div>
                        <div className={activityKey == 'doc' ? 'tab-menu-item activity' : 'tab-menu-item'} onClick={() => { this.changeActiveKey('doc') }}>文档</div>
                    </div>
                    <div className="tab-content-background">
                        <div className={activityKey == 'chat' ? 'tab-content-item' : 'tab-content-item none'}>
                            <div style={{ display: 'flex', flexDirection: 'column-reverse', flex: '1', width: '100vw' }}>
                                <div className='mobile-main-chat-send-wrapper'>
                                    <textarea className='mobile-main-chat-send-cont' ref={node => this.input = node} />
                                    <span className='mobile-btn-send' onClick={this.onClickBtnSendButton}>发送</span>
                                </div>
                                <div style={{ flex: '1', width: '100%' }}>
                                    <ChatList onRef={this.props.createChatListRef} list={this.props.chatList} selfHeight={"calc(" + window_height + " - 4.22rem - 0.88rem - 0.79rem - " + rollingAdHeight + ")"} />
                                </div>
                            </div>
                        </div>
                        <div className={activityKey == 'doc' ? 'tab-content-item' : 'tab-content-item none'} style={{ height: "calc(" + window_height + " - 4.22rem - 0.88rem - " + rollingAdHeight + ")" }}>
                            {
                                this.props.currentPic ?
                                    <img style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} src={this.props.currentPic || ""} /> :
                                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>暂无文档</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}