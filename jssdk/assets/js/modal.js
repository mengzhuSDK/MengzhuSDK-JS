(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modal"],{

/***/ "./src/index.js":
/*!**********************************!*\
  !*** ./src/index.js + 2 modules ***!
  \**********************************/
/*! no exports provided */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react-dom/index.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react-router-dom/index.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/react/index.js (<- Module is not an ECMAScript module) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__("./node_modules/react/index.js");
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__("./node_modules/react-dom/index.js");
var react_dom_default = /*#__PURE__*/__webpack_require__.n(react_dom);

// EXTERNAL MODULE: ./node_modules/react-router-dom/index.js
var react_router_dom = __webpack_require__("./node_modules/react-router-dom/index.js");

// CONCATENATED MODULE: ./src/router/lazyLoad.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 懒加载方法


var lazyLoad_lazyLoad = function lazyLoad(importComponent) {
   return function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class() {
         _classCallCheck(this, _class);

         var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

         _this.state = {
            component: null
         };
         return _this;
      }

      _createClass(_class, [{
         key: 'componentDidMount',
         value: function componentDidMount() {
            var _this2 = this;

            importComponent().then(function (cmp) {
               _this2.setState({ component: cmp.default });
            });
         }
      }, {
         key: 'render',
         value: function render() {
            var C = this.state.component;
            return C ? react_default.a.createElement(C, this.props) : react_default.a.createElement(
               'div',
               null,
               '\u9875\u9762\u52A0\u8F7D\u4E2D...'
            );
         }
      }]);

      return _class;
   }(react_default.a.Component);
};

/* harmony default export */ var router_lazyLoad = (lazyLoad_lazyLoad);
// CONCATENATED MODULE: ./src/router/routes.js
/*
   Root, Router 配置
*/




var Main = router_lazyLoad(function () {
    return Promise.all(/*! import() | main */[__webpack_require__.e("vendors"), __webpack_require__.e("main")]).then(__webpack_require__.bind(null, /*! pages/main */ "./src/pages/main/index.js"));
});
var routes_Root = function Root() {
    return react_default.a.createElement(
        react_router_dom["Switch"],
        null,
        react_default.a.createElement(react_router_dom["Route"], { path: "/", exact: true, component: Main })
    );
};

/* harmony default export */ var routes = (routes_Root);
// CONCATENATED MODULE: ./src/index.js





var mountNode = document.getElementById('page');
react_dom_default.a.render(react_default.a.createElement(
    react_router_dom["HashRouter"],
    { basename: '/' },
    react_default.a.createElement(routes, null)
), mountNode);

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/lifeng/Desktop/mengzhuGit/MengzhuSDK-JS/src/index.js */"./src/index.js");


/***/ })

},[[0,"manifest","vendors"]]]);
//# sourceMappingURL=modal.js.map