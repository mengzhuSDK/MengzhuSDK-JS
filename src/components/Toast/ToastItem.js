import React from 'react'
class ToastItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldClose: false, // 是否开启关闭动画
    }
  }
  supportCss3() {
    let div = document.createElement('div'),
      vendors = 'Ms O Moz Webkit'.split(' '),
      len = vendors.length;
    return function (prop) {
      if (prop in div.style) return true;

      prop = prop.replace(/^[a-z]/, function (val) {
        return val.toUpperCase();
      });

      while (len--) {
        if (vendors[len] + prop in div.style) {
          return true;
        }
      }
      return false;
    };
  }

  componentDidMount() {
    if (this.props.duration > 0) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration - 300); // 减掉消失动画300毫秒
    }
  }

  componentWillUnmount() {
    // 当有意外关闭的时候 清掉定时器
    this.clearCloseTimer();
  }

  clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  close() {
    // 关闭的时候 应该先清掉倒数定时器
    // 然后开启过场动画
    // 等待动画结束 执行回调
    this.clearCloseTimer();
    const _this = this;
    _this.setState({shouldClose: true});
    this.timer = setTimeout(() => {
      if (this.props.onClose) {
        this.props.onClose();
      }
      clearTimeout(_this.timer);
    }, 300);
  }

  render() {
    const {shouldClose} = this.state;
    const {msg, type} = this.props;
    // let hideType = this.supportCss3("transition") ? "leave" : "hide";
    return (
      <div className="toast-content-wrap">
        <div className={`toast-content ${type}`}>
          { msg }
        </div>
      </div>

    )
  }
}


export default ToastItem