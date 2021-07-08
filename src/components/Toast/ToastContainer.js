import React from 'react'
import ReactDOM from 'react-dom'
import ToastItem from './ToastItem';
import "./toast.css";
class ToastContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            notices: [], // 存储当前有的notices
            hasMask: true, // 是否显示蒙版
        }
    }
    add (notice) {
        // 添加notice
        // 创造一个不重复的key
        let {notices} = this.state;
        const key = notice.key ? notice.key : notice.key = getUuid();
        const temp = notices.filter((item) => item.key === key).length;
        // 此处控制显示多个还是一个,清空为显示一个，不清空可显示多个
        notices = [];
        if(!temp){
            // 不存在重复的 添加
            notices.push(notice);
            this.setState({
                notices: notices,
            });
        }
    }
    remove (key) {
        // 根据key删除对应
        this.setState(previousState => ({notices: previousState.notices.filter(notice => notice.key !== key)}));
    }
    getNoticeDOM () {
      const _this = this;
      const {notices} = this.state;
      const result = [];

      notices.map((notice) => {
        // 每个Notice onClose的时候 删除掉notices中对应key的notice
        const closeCallback = () => {
          _this.remove(notice.key);
        };

        result.push(
          <ToastItem
            key={notice.key} {...notice}
            onClose={closeCallback}
          />
        );

      });

      return result;
    }
    render () {
        const noticesDOM = this.getNoticeDOM();
        return (
        noticesDOM.length?
            <div className="toast-container" style={{'zIndex':9999}}>
              {noticesDOM}
            </div>:null
        )
    }
}

// 统计notice总数 防止重复
let noticeNumber = 0;

// 生成唯一的id
const getUuid = () => {
    return 'toast-' + new Date().getTime() + '-' + noticeNumber++;
};
export default ToastContainer