import React from 'react';
import "./index.css"
import "../player.css"
import ChatList from '../../components/ChatList';
import VideoAd from '../../components/VideoAd';

export default class PCPlayer extends React.Component {
    /**
     * pc播放器
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
     */

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // window.onresize = function () {
        //     let height = (((window.innerWidth * 0.5) / 16) * 9).toFixed(3);
        //     let videoWrapper = document.getElementById("mz-video-wrapper");
        //     if (videoWrapper !== null && videoWrapper !== undefined) {
        //         // videoWrapper.style.height = height + 'px';
        //         videoWrapper.style.width = '50%';
        //     }
        // };
    }

    onClickBtnSendButton = () => {
        this.props.btnSend(this.input)
    }
    
    render() {
        return (
            <div>
                <div className={this.props.ticketInfo && this.props.ticketInfo.status == 2 ? 'main-top-pc' : 'main-top-pc live-video-background'}>
                    {
                        this.props.isShowErrorDisplay && this.props.isShowErrorDisplay == true ?
                            <div className={'main-left-pc'}>
                                <img className="errorImage" width="100%" height="100%" src={this.props.ticketInfo ? this.props.ticketInfo.cover : ''} />
                                <div className="errorContent">{this.props.errorContent}</div>
                            </div> :
                            <div className={'main-left-pc'} id="mz-video-wrapper" />
                    }
                    <div style={{ display: 'flex', flexDirection: 'column-reverse', flex: '1', minHeight: '454px', minWidth: '400px' }}>
                        <div className='main-chat-send-wrapper'>
                            <textarea className='main-chat-send-cont' ref={node => this.input = node} />
                            <span className='btn-send' onClick={this.onClickBtnSendButton}>发送</span>
                        </div>
                        <div style={{ flex: '1', width: '100%' }}>
                            <ChatList onRef={this.props.createChatListRef} list={this.props.chatList} selfHeight="351px" />
                        </div>
                    </div>
                </div>
                <div>
                    <img src={this.props.currentPic || ""} />
                </div>
                <VideoAd 
                    type={0}
                    ticketId={this.props.ticketId}
                    poster={this.props.ticketInfo ? this.props.ticketInfo.cover : ''}
                >
                </VideoAd>
            </div>
        );
    }
}