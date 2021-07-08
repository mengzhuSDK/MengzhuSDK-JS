import React from 'react';
import { Input } from 'antd';
import Toast from 'components/Toast';
import "./index.css"

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketId: '', // release - 10181510, test - 10018344
        }
    }

    componentDidMount() {

    }

    onChange = (e) => {
        this.setState({ ticketId: e.target.value });
    }

    enterTicket = () => {
        let { ticketId } = this.state;
        if (!ticketId || ticketId.length <= 0) {
            Toast.show('请输入活动ID', 'error')
            return;
        }
        this.props.history.push(`/main/${ticketId}`);
    }

    render() {
        let { ticketId } = this.state;
        return (
            <div>
                <div className="empty-note">首页</div>
                <div className="home-background">
                    <img className="home-image" src={require('../../assets/images/mz_home_logo.png')} width='120' height='120'></img>
                    <Input className="home-input-ticket-id" placeholder="请输入活动ID，例:10181510" defaultValue={ticketId} value={ticketId} onChange={this.onChange}></Input>
                    <div className="empty-back" onClick={this.enterTicket}>进入活动</div>
                </div>
            </div>
        );
    }
}