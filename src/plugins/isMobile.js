export default {
  install(Vue) {
    Vue.prototype.$smallScreen = function() {
      return window.innerWidth < 992;
    };
    Vue.prototype.$xSmallScreen = function() {
      return window.innerWidth < 600;
    };
  }
};
