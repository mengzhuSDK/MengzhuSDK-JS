import React from 'react';
import './index.css'

/**
 * 竖屏聊天列表
 */

export default class ChatListVertical extends React.Component {

    componentDidMount() {
        this.props.onRef(this)
    }

    componentDidUpdate() {
        const mzMessageListEndRefOfVertical = document.getElementById("mzMessageListEndRefOfVertical");
        mzMessageListEndRefOfVertical.scrollIntoView();//不带动画
        // mzMessageListEndRefOfVertical.scrollIntoView({ behavior: "smooth" });//带动画
    }

    updateList = () => {
        this.forceUpdate();
    }

    render() {
        let { list } = this.props;
        return (<div className="chatlistvertical-wrapper">
            {
                list.map((item, index) => {
                    return (<li className="msg-caption-vertical-box" key={`chatlist-item-${index}`}>
                        <div className="msg-caption-vertical-item">
                            <div className="user-name-vertical">{item.userName}：</div>
                            <div className="msg-content-vertical isSelf">{item.text || '其他未解析消息'}</div>
                        </div>
                    </li>)
                })
            }
            <div id="mzMessageListEndRefOfVertical"></div>
        </div>);
    }
}