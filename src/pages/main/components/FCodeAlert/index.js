import React from 'react';
import './index.css';
import Dialog from 'components/Dialog';
import Toast from 'components/Toast';
import { Input } from 'antd';
import { isMobile } from "common/common"
import mzsdk from '../../../../utils/mzsdk'

/**
 * F码 - 输入F码弹窗
 */

export default class FCodeAlert extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
            fCode: "",
            isMobile: false,
        })
    }

    componentDidUpdate() {

    }

    componentDidMount() {
        this.setState({
            isMobile: isMobile() ? true : false
        })
    }

    onChange = (e) => {
        this.setState({ fCode: e.target.value });

    }

    sureClick = () => {
        var _this = this;
        let { fCode } = this.state;
        if (fCode.length <= 0) {
            Toast.show("请输入F码", 'error')
            return;
        }
        var data = {
            ticketId: this.props.ticketId,
            fCode: fCode
        }
        console.log("data:",data);

        mzsdk.useFCode(data).then(function (res) {
            _this.props.addCallBack()
        }, function (err) {
            Toast.show(err.msg, 'error')
        })
    }

    render() {
        let { fCode, isMobile } = this.state;
        return (
            <Dialog title="盟主直播" className='create-fCode-dialog' width={isMobile ? '6.4rem' : 480} afterClose={() => this.props.dialogHandle()}
            >
                <div className={isMobile ? 'mobile-note' : 'note'}>视频设置了F码，请输入F码观看</div>
                <Input className={isMobile ? 'mobile-tf' : 'tf'} placeholder="请输入F码" value={fCode} onChange={this.onChange}></Input>
                <div className={isMobile ? 'mobile-sure' : 'sure'} onClick={this.sureClick}>确定</div>
            </Dialog>

        )
    }
}