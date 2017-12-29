import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
// import sortablejs from 'sortablejs'
import 'element-ui/lib/theme-default/index.css'
import './css/common.css'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
// Vue.use(sortablejs)

Vue.config.productionTip = false

import components from './components/'
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component(`v${name}`, components[key])
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// console.log([
//   "                   _ooOoo_",
//   "                  o8888888o",
//   "                  88\" . \"88",
//   "                  (| -_- |)",
//   "                  O\\  =  /O",
//   "               ____/`---'\\____",
//   "             .'  \\\\|     |//  `.",
//   "            /  \\\\|||  :  |||//  \\",
//   "           /  _||||| -:- |||||-  \\",
//   "           |   | \\\\\\  -  /// |   |",
//   "           | \\_|  ''\\---/''  |   |",
//   "           \\  .-\\__  `-`  ___/-. /",
//   "         ___`. .'  /--.--\\  `. . __",
//   "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
//   "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
//   "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
//   "======`-.____`-.___\\_____/___.-`____.-'======",
//   "                   `=---='",
//   "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
//   "         佛祖保佑       永无BUG",
//   "当初说好加班给加班费的，赶这个erp加班加的想吐，到了发工资说，没有加班费，呵呵。诚信呢？"
// ].join('\n'));
