import React from 'react';
import "./index.css"
import "../player.css"

import DisableRecordScreen from "../../components/DisableRecordScreen";
import ChatListVertical from '../../components/ChatListVertical';
import VideoAd from '../../components/VideoAd';

export default class VerticalPlayer extends React.Component {
    /**
     * 竖屏播放器
     * 
     * @param {isShowErrorDisplay} props 是否显示错误信息
     * @param {errorContent} props 错误信息内容
     * @param {ticketInfo} props 当前活动信息
     * @param {ticketId} props 当前活动ID
     * 
     * @param {btnSend} props 发送消息回调
     * @param {chatList} props 聊天消息列表
     * @param {createChatListRef} props 获取消息Ref
     * @param {getRef} props 返回自己的Ref
     */

    constructor(props) {
        super(props);
        this.state = {
            chatInputBoxShow: false,
        }
    }

    componentDidMount() {
        this.props.getRef(this);
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

    toEnterInputBox = () => {
        this.setState({
            chatInputBoxShow: true
        }, () => {
            this.input.focus();
        })
    }

    onBlur = () => {
        if (this.input.value.trim().length <= 0) {
            this.setState({
                chatInputBoxShow: false
            })
            return;
        }
    }

    onClickBtnSendButton = () => {
        this.props.btnSend(this.input)
        this.setState({
            chatInputBoxShow: false
        })
    }

    render() {
        let { chatInputBoxShow } = this.state;
        return (
            <div className={this.props.ticketInfo && this.props.ticketInfo.status == 2 ? 'main-top-vertical' : 'main-top-vertical live-video-background'} ref={ref => this.disableRecordScreenPartnerRef = ref}>
                {
                    this.props.isShowErrorDisplay && this.props.isShowErrorDisplay == true ?
                        <div className={'main-top-video-vertical'}>
                            <img className="errorImage" width="100%" height="100%" src={this.props.ticketInfo ? this.props.ticketInfo.cover : ''} />
                            <div className="errorContent">{this.props.errorContent}</div>
                        </div> :
                        <div>
                            <div className={'main-top-video-vertical'} id="mz-video-wrapper" />
                            {
                                <DisableRecordScreen
                                    partnerRef={this.disableRecordScreenPartnerRef}
                                    getRef={this.getDisableRecordScreen}
                                >
                                </DisableRecordScreen>
                            }
                        </div>
                }
                {

                    chatInputBoxShow ?
                        <div className='inputBoxShow'>
                            <textarea className='inputBoxShow-send-cont' ref={node => this.input = node} onBlur={this.onBlur} />
                            <span className='inputBoxShow-send' onClick={this.onClickBtnSendButton}>发送</span>
                        </div> : (
                            this.props.ticketInfo && this.props.ticketInfo.status != 0 && <div className="toolsBox">
                                <div className="toolsBoxEnters" onClick={this.toEnterInputBox}>说点什么...</div>
                            </div>
                        )
                }
                <div className="chatMsgBox">
                    <ChatListVertical onRef={this.props.createChatListRef} list={this.props.chatList} />
                </div>
                <VideoAd
                    type={2}
                    ticketId={this.props.ticketId}
                    poster={this.props.ticketInfo ? this.props.ticketInfo.cover : ''}
                >
                </VideoAd>
            </div>
        );
    }
}