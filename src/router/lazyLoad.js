// 懒加载方法
import React from 'react';



const lazyLoad = importComponent => {
   return class extends React.Component {
      constructor() {
         super();
         this.state = {
            component: null
         };
      }

      componentDidMount() {
         importComponent().then(cmp => {
            this.setState({ component: cmp.default });
         });
      }

      render() {
         const C = this.state.component;
         return C ? <C {...this.props} /> : <div>页面加载中...</div>;
      }
   }
}

export default lazyLoad;