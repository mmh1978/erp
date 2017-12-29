import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  routes,
  // mode: 'history',
  base: ''
})

let userRoles
router.beforeEach(({ meta, path }, from, next) => {
  (!!sessionStorage.userRoles) ? userRoles = JSON.parse(sessionStorage.userRoles).rights : userRoles = []
  const isLogin = Boolean(localStorage.getItem('token'))
  if (!isLogin && path !== '/login') {
    let to = { path: '/login' }
    return next(to)
  } else if (!!meta.role && (!(userRoles.indexOf(meta.role) >= 0))) {
    let to = { path: '/login' }
    return next(to)
  }
  next()
})

export default router
