import React from 'react';
import './index.css';
import Dialog from 'components/Dialog';
import { isMobile } from "common/common"

/**
 * 被主播踢出的弹窗
 */

export default class GetKickoutAlert extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
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

    sureClick = () => {
        this.props.dialogHandle()
    }

    render() {
        let { isMobile } = this.state;
        return (
            <Dialog title="盟主直播" className='get-kickout-dialog' width={isMobile ? 320 : 480} afterClose={() => this.props.dialogHandle()}
            >
                <div className='note' style={{fontSize: isMobile ? '0.3rem' : '20px' }}>您已被踢出</div>
                <div className={isMobile ? 'mobile-sure' : 'sure'} onClick={this.sureClick}>确定</div>
            </Dialog>

        )
    }
}
