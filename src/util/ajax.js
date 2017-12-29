'use strict'
import Vue from 'vue'
import vueResource from 'vue-resource'

Vue.use(vueResource)

Vue.http.interceptors.push((request, next) => {
  if (!!localStorage.token) {
    request.headers.set('Authorization', localStorage.token)
  }
  next()
})

export default {
  data() {

  },
  methods: {
    login(url, params, callback) {
      this.$http.post(url, params).then((response) => {
        callback(response.body)
      }, (response) => {
        console.error(response)
      })
    },
    fetchData(url, params, callback) {
      this.$http.get(url, params).then((response) => {
        if (response.body.code == '-997') {
          this.$router.push({ name: 'login' })
          this.$message.warning('请重新登录')
        } else {
          callback(response.body)
        }
      }, (response) => {
        console.error(response)
      })
    },
    subForm(url, params, callback) {
      this.$http.post(url, params).then((response) => {
        if (response.body.code == '-997') {
          this.$router.push({ name: 'login' })
          this.$message.warning('请重新登录')
        } else {
          callback(response.body)
        }
      }, (response) => {
        console.error(response)
      })
    },
    patchData(url, params, callback) {
      this.$http.patch(url, params).then((response) => {
        if (response.body.code == '-997') {
          this.$router.push({ name: 'login' })
          this.$message.warning('请重新登录')
        } else {
          callback(response.body)
        }
      }, (response) => {
        console.error(response)
      })
    },
    deleteData(url, params, callback) {
      this.$http.delete(url, params).then((response) => {
        if (response.body.code == '-997') {
          this.$router.push({ name: 'login' })
          this.$message.warning('请重新登录')
        } else {
          callback(response.body)
        }
      }, (response) => {
        console.error(response)
      })
    },
    putData(url, params, callback) {
      this.$http.put(url, params).then((response) => {
        if (response.body.code == '-997') {
          this.$router.push({ name: 'login' })
          this.$message.warning('请重新登录')
        } else {
          callback(response.body)
        }
      }, (response) => {
        console.error(response)
      })
    }
  }
}
