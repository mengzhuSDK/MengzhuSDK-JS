import React from 'react';
import './index.css'

export default class ChatList extends React.Component {

    componentDidUpdate() {
        const mzMessageListEndRef = document.getElementById("mzMessageListEndRef");
        mzMessageListEndRef.scrollIntoView();//不带动画
        // mzMessageListEndRef.scrollIntoView({ behavior: "smooth" });//带动画
    }

    render() {
        let { list } = this.props;
        return (<ul className="chatlist-wrapper">
            {
                list.map((item, index) => {
                    return (<li className="msg-caption" key={`chatlist-item-${index}`}>
                    <img className="user-host" src={item.avatar ? item.avatar : "//s1.zmengzhu.com/web/wap/img/default-avatar.jpg"} />
                    <h3 className="user-name">{item.userName}</h3>
                    <p className="time">{item.time}</p>
                    <p className="msg-content isSelf">{item.text}</p>
                </li>)
                })
            }
            <div id="mzMessageListEndRef"></div>
        </ul>);
    }
}