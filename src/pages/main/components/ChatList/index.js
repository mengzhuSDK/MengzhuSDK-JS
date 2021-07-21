import React from 'react';
import './index.css'
import { isMobile } from "common/common"

/**
 * pc和二分屏聊天列表
 */

export default class ChatList extends React.Component {

    componentDidMount() {
        this.props.onRef(this)
    }

    componentDidUpdate() {
        const mzMessageListEndRef = document.getElementById("mzMessageListEndRef");
        mzMessageListEndRef.scrollIntoView();//不带动画
        // mzMessageListEndRef.scrollIntoView({ behavior: "smooth" });//带动画
    }

    updateList = () => {
        this.forceUpdate();
    }

    render() {
        let { list } = this.props;
        let _isMobile = isMobile();
        return (<ul className="chatlist-wrapper" style={{height: this.props.selfHeight, padding: _isMobile ? '0 0.2rem' : '0 10px', margin: _isMobile ? '0' : '10px 0'}}>
            {
                list.map((item, index) => {
                    return (<li className="msg-caption" key={`chatlist-item-${index}`}>
                    <img className="user-host" src={item.avatar ? item.avatar : "//s1.zmengzhu.com/web/wap/img/default-avatar.jpg"} />
                    <h3 className="user-name" style={{maxWidth: _isMobile ? '2.8rem' : '250px'}}>{item.userName}</h3>
                    <p className="time">{item.time}</p>
                    <p className="msg-content isSelf">{item.text || '其他未解析消息'}</p>
                </li>)
                })
            }
            <div id="mzMessageListEndRef"></div>
        </ul>);
    }
}