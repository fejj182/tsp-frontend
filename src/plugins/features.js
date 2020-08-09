const config = {
  features: {
    welcomePanel: parse(process.env.VUE_APP_FT_WELCOME_PANEL_ACTIVE, false)
  }
};
function feature(name) {
  return config.features[name];
}
function parse(value, fallback) {
  if (typeof value === "undefined") {
    return fallback;
  }
  switch (typeof fallback) {
    case "boolean":
      return !!JSON.parse(value);
    case "number":
      return JSON.parse(value);
    default:
      return value;
  }
}
export { config };
export default {
  install(Vue) {
    Vue.prototype.$appConfig = config;
    Vue.prototype.$feature = feature;
  }
};
