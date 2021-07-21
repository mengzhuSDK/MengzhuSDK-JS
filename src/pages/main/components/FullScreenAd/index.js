import React from 'react';
import './index.css';
import mzsdk from 'utils/mzsdk';
import { Carousel } from 'antd';

/**
 * 启动广告（暖场图）
 */

var timer = null;

export default class FullScreenAd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketId: props.ticketId || '',
            data: [],
            stay_duration: -1,
            isDelayShowSkipButton: false,
        }
    }

    componentDidMount() {
        var _this = this;
        let { ticketId } = this.state;

        let params = {
            ticketId: ticketId
        }
        mzsdk.getVideoScreenAdvert(params).then(function (res) {
            console.log("获取启动广告成功：", res);
            _this.setState({
                data: res.full_screen.content
            }, () => {
                _this.startInterval(res.full_screen.stay_duration);
            })
        }, function (error) {
            console.log("获取启动广告失败：", error);
            _this.end('error', '')
        })
    }

    startInterval(duration) {
        var _this = this;
        if (timer) {
            clearInterval(timer);
        }
        this.setState({
            stay_duration: duration,
        }, () => {
            setTimeout(() => {
                _this.setState({
                    isDelayShowSkipButton: true,
                }, () => {
                    timer = setInterval(() => {
                        _this.state.stay_duration = _this.state.stay_duration - 1;
                        _this.setState({
                            stay_duration: _this.state.stay_duration
                        }, () => {
                            if (_this.state.stay_duration <= 0) {
                                _this.end('end', '')
                            }
                        })
                    }, 1000);
                })
            }, 800);
        })
    }

    end(event, link) {
        if (timer) {
            clearInterval(timer)
        }
        this.props.event(event, link)
    }

    render() {
        let { data, stay_duration, isDelayShowSkipButton } = this.state;
        return (
            <div className="full-screen-ad-background">
                <Carousel autoplay autoplaySpeed={1500}>
                    {
                        data.map((element, index) => (
                            <img key={index} className="full-screen-ad-item" src={element.image} onClick={() => { this.end('click', element.link) }} />
                        ))
                    }
                </Carousel>
                {
                    isDelayShowSkipButton && <div className="skip-button" onClick={() => { this.end('skip', ''); }}>跳过{stay_duration == -1 ? '' : stay_duration}</div>
                }
            </div>

        )
    }
}
