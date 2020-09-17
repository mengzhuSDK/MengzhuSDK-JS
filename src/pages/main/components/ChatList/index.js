import React from 'react';
import './index.css'

export default class ChatList extends React.Component {

    render() {
        let { list } = this.props;
        return (<ul className="chatlist-wrapper">
            {
                list.map((item, index) => {
                    return (<li className="msg-caption" key={`chatlist-item-${index}`}>
                    <img className="user-host" src="//s1.zmengzhu.com/web/wap/img/default-avatar.jpg" />
                    <h3 className="user-name">{item.userName}</h3>
                    <p className="time">{item.time}</p>
                    <p className="msg-content isSelf">{item.text}</p>
                </li>)
                })
            }
        </ul>);
    }
}