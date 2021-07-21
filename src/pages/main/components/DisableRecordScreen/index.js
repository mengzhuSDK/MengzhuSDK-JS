import React from 'react';
import { isMobile } from "common/common"

/**
 * 防录屏组件
 * 
 * @param partnerRef 父级别的Ref
 * 
 * @function getRef() 供父类获取本Ref
 */

export default class DisableRecordScreen extends React.Component {
    constructor(props) {
        super(props);
        // 自己的dom
        this.disableRecordScreenRef = null;
        // 定时器
        this.timer = null;
       
        // 间隔 毫秒
        this.interval = 10000;

        this.state = {
            cString: '防录屏字符串', // 防录屏字符串
            isShow: false,//是否展示本身
        }
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    // 展示防录屏
    startDisableRecordScreenRef = (cString) => {
        if (this.timer) {
            this.endDisableRecordScreenRef();
        }
        if (this.disableRecordScreenRef) {
            this.disableRecordScreenRef.style.left = 0;
            this.disableRecordScreenRef.style.top = 0;
        }

        var _this = this;

        if (cString && cString.length > 0) {
            this.setState({
                cString: cString
            })
        }

        this.timer = setInterval(() => {
            let position = _this.position();
            if (_this.disableRecordScreenRef) {
                _this.disableRecordScreenRef.style.left = position.left;
                _this.disableRecordScreenRef.style.top = position.top;
            }
        }, this.interval);

        this.setState({
            isShow: true
        })
    }

    // 隐藏防录屏
    endDisableRecordScreenRef = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = null;
        this.setState({
            isShow: false
        })
    }

    //更新间隔秒,并且重新开始定时器
    updateTimerInterval = (interval) => {
        this.interval = interval;
        this.endDisableRecordScreenRef();
        this.startDisableRecordScreenRef()
    }

    // 更新防录屏字符串
    updateCString = (cString) => {
        this.setState({
            cString: cString
        })
    }

    // 计算位置
    position = () => {
        let max_width = this.props.partnerRef ? this.props.partnerRef.clientWidth : 375;
        let max_height = this.props.partnerRef ? this.props.partnerRef.clientHeight : 210;

        let self_width = this.disableRecordScreenRef ? this.disableRecordScreenRef.clientWidth : 80;
        let self_height = this.disableRecordScreenRef ? this.disableRecordScreenRef.clientHeight : 30;

        var left = Math.random() * (max_width - self_width) + 'px';
        var top = Math.random() * (max_height - self_height) + 'px';
        return {
            left: left,
            top: top
        };
    }

    render() {
        let { cString, isShow } = this.state;
        return (
            <div style={{ position: 'fixed', zIndex: '9996', color: '#FF5B29', display: isShow == true ? 'block' : 'none' }} ref={ref => this.disableRecordScreenRef = ref} className="disableRecordScreen">{cString}</div>

        );
    }
}