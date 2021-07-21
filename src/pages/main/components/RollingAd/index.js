import React from 'react';
import './index.css';
import mzsdk from 'utils/mzsdk';
import { Carousel } from 'antd';

/**
 * 二分屏里的滚动广告
 */

export default class RollingAd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketId: props.ticketId || '',
            data: [],
            isShow: false,
        }
    }

    componentDidMount() {
        var _this = this;
        let { ticketId } = this.state;

        let params = {
            ticketId: ticketId
        }
        mzsdk.getRollingAdvert(params).then(function (res) {
            console.log("获取滚动广告成功：", res);
            let data = res.roll_advert;
            let isShow = true;
            if (data.length <= 0) {
                data = [];
                isShow = false;
            }
            _this.setState({
                data: data,
                isShow: isShow
            }, () => {
                _this.props.isShow(isShow)
            })

        }, function (error) {
            console.log("获取滚动广告失败：", error);
            let isShow = false;
            _this.setState({
                data: [],
                isShow: isShow
            }, () => {
                _this.props.isShow(isShow)
            })
        })
    }

    render() {
        let { data, isShow } = this.state;
        return (
            <div className="rolling-ad-background" style={{ height: '1.6rem', display: isShow ? 'block' : 'none' }}>
                <Carousel autoplay={true} autoplaySpeed={5000}>
                    {
                        data.map((element, index) => (
                            element.type == 0 ?
                                <div key={index} className="rolling-ad-item" onClick={() => { this.props.clickRollingAd(element.link) }}>
                                    <div className="rolling-ad-item-text" style={{ fontSize: (element.style.fontSize * 2 / 100) + 'rem' || '0.36rem', color: element.style.fontColor || 'black', background: element.style.backgroundColor || 'white' }}>{element.content}</div>
                                </div> : (
                                    element.type == 1 &&
                                    <img key={index} className="rolling-ad-item-image" src={element.content} onClick={() => { this.props.clickRollingAd(element.link) }} width="100%" height="1.6rem"></img>
                                )
                        ))
                    }
                </Carousel>
            </div>

        )
    }
}
