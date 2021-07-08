import ToastContainer from './ToastContainer';
import React from "react";
import ReactDOM from "react-dom";
let newToast;
ToastContainer.reWrite = function (properties) {
    const { ...props } = properties || {};
    let div;
    div = document.createElement('div');
    document.body.appendChild(div);
    let notification;
    notification = ReactDOM.render(<ToastContainer {...props} />, div);
    return {
        notice(noticeProps) {
            notification.add(noticeProps);
        },
        removeNotice(key) {
            notification.remove(key);
        },
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        },
        component: notification
    }
};
const getNewToast = () => {
    if (!newToast) {
      newToast = ToastContainer.reWrite();
    }
    return newToast;
};
const toast = (msg,type,durationTime) => {
    let toastInstance = getNewToast();
    let duration=durationTime||3000;
    toastInstance.notice({msg,type,duration});
};
getNewToast();
export default {
    show: (msg,type,durationTime) => (toast(msg,type,durationTime)),
}