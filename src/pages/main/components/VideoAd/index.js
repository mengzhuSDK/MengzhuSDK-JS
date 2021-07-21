import React from 'react';
import './index.css';
import mzsdk from 'utils/mzsdk';
import videojs from 'video.js';
import '../../../../assets/css/video-js.css'

/**
 * 片头广告
 */

export default class VideoAd extends React.Component {
    constructor(props) {
        super(props);
        this.player = null;
        this.state = {
            ticketId: props.ticketId || '',
            isShow: true,
            type: props.type ? props.type : '-1',// pc:type = 0, super:type = 1, vertical:type = 2

            isShowCountDown: false,//是否显示倒计时
            isShowSkinButton: false,//是否显示跳过按钮
            currentTime: 0,//当前剩余时间
        }
    }

    componentWillUnmount() {
        console.log('片头广告组件释放');
        this.disposePlayer()
    }

    componentDidMount() {
        var _this = this;
        let { ticketId, } = this.state;

        let params = {
            ticketId: ticketId
        }
        mzsdk.getVideoAdvert(params).then(function (res) {
            console.log("获取片头广告成功：", res);
            if (!res.video_advert || !res.video_advert.video_url || res.video_advert.video_url.length <= 0) {
                _this.endAdvert();
                return;
            }
            //如果没有观看过此广告 或者 每次都播放的选项，直接播放
            if (parseInt(res.video_advert.is_watch_video_advert) != 1 || parseInt(res.video_advert.play_frequency) == 1) {
                _this.player = videojs("mz-video-pre", {
                    autoplay: false,
                    poster: _this.props.poster,
                    sources: [{
                        src: res.video_advert.video_url
                    }]
                }, function onPlayerReady() {
                    // 播放器准备完毕
                    console.log("准备广告播放");

                    this.on('firstplay', function (e) {
                        console.log('第一次播放');
                        // 第一次播放
                        let isShowTime = true
                        let isShowSkin = false
                        if (parseInt(res.video_advert.allow_skip) == 1) {
                            isShowSkin = true
                        }
                        _this.setState({
                            isShowCountDown: isShowTime,
                            isShowSkinButton: isShowSkin
                        })
                        _this.updateSkinTime();
                    })

                    this.on("play", function (e) {
                        // 视频开始播放
                        console.log("广告开始播放");
                    });
                    this.on("pause", function (e) {
                        // 播放暂停（点击暂停按钮或调用暂停方法）
                        console.log("广告暂停播放");
                    });
                    this.on('ended', function (e) {
                        // 播放结束
                        console.log("广告结束播放");
                        _this.endAdvert();
                    });
                    this.on('error', function (e) {
                        // 播放错误
                        console.log("广告播放错误");
                        _this.endAdvert();
                    })
                    this.on("timeupdate", function (e) {
                        _this.updateSkinTime();
                    });
                });
            } else {
                _this.endAdvert();
            }
        }, function (error) {
            console.log("获取片头广告失败：", error);
            _this.endAdvert();
        })
    }

    updateSkinTime = () => {
        let duration = parseInt(this.player.duration());
        let cTime = parseInt(this.player.currentTime());
        let countDown = this.formatTime(duration - cTime);
        this.setState({
            currentTime: countDown
        })
    }

    formatTime = (time) => {
        if (time != time) {
            return '000';
        }
        var finnalTime = ""
        if (time < 10) {
            finnalTime = "00" + time;
        } else if (time < 100) {
            finnalTime = "0" + time;
        } else {
            finnalTime = "" + time;
        }
        return finnalTime;
    }

    endAdvert = () => {
        var _this = this;
        this.setState({
            isShow: false
        }, () => {
            _this.disposePlayer()
        })
    }

    disposePlayer = () => {
        if (this.player) {
            this.player.dispose();
        }
    }

    clickSkipButton = () => {
        this.endAdvert();
    }

    render() {
        let { isShow, type, isShowSkinButton, currentTime, isShowCountDown } = this.state;
        let width = type == 1 || type == 2 ? '100vw' : '861px';
        let height = type == 2 ? '100vh' : (type == 1 ? '4.22rem' : '484px');
        return (
            <div className="pre-video-background" style={{ display: isShow ? 'block' : 'none', width: width, height: height }}>
                <video
                    id="mz-video-pre"
                    className="video-js"
                    x5-video-player-type="h5-page"
                    x5-video-player-fullscreen="true"
                    preload="auto"
                    type="application/x-mpegURL"
                    controlsList="nodownload"
                    playsinline=""
                    webkit-inline=""
                    webkit-playsinline=""
                    x5-playsinline=""
                    x-webkit-airplay="allow"
                    controls
                    disablePictureInPicture
                />
                {
                    isShowCountDown &&
                    <div>
                        <div className="time-skin-background">
                            <div className="time-count">{currentTime}</div>
                            {
                                isShowSkinButton &&
                                <div className="skip-button" onClick={this.clickSkipButton}>跳过</div>
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}
