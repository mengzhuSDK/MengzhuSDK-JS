import React from 'react';
import './index.css';
import { Modal } from 'antd';

export default class Dialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: true
        }
    }

    componentDidUpdate() {

    }

    componentDidMount() {

    }

    render() {
        let { visible } = this.state;
        return (
            <Modal
                visible={visible}
                title={this.props.title}
                footer={null}
                width={this.props.width}
                afterClose={()=>this.props.afterClose()}
                onCancel={()=>this.props.afterClose()}
                className={this.props.className}
                maskClosable={false}
                closable={this.props.closable == 'none' ? false : true}
            >
                {this.props.children}
            </Modal>

        )
    }
}