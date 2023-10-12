import axios from 'axios';
import base from '../config/api.config'
import paths from '../network/paths';

export default class Request {
  user
  router
  debugMode

  constructor(user, router, debugMode = false) {
    this.debugMode = debugMode
    this.user = user
    this.router = router
    this.setup()
  }

  setup() {
    this.config()
    this.setupDebug()
    this.setupLogoutAfterNotAuthRequest()
  }

  config() {
    // Axios config
    axios.defaults.baseURL = base.url
    axios.defaults.headers.common['x-access-token'] = this.user.userToken
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.timeout = 30000
  }

  setupDebug() {
    if (this.debugMode) {
      axios.interceptors.request.use(request => {
        console.log('Starting Request', JSON.stringify(request, null, 2))
        console.log(`🗼 [${request.method}] - ${request.baseURL}${request.url}`);
        return request
      })
    }
  }

  setupLogoutAfterNotAuthRequest() {
    axios.interceptors.response.use(response => response, error => {
      if (error.response.status === 401) {
        this.user.logout()
        this.checkRouterAndGoHome()
      }
    });
  }

  async checkRouterAndGoHome() {
    await this.router.isReady()
    this.router.push("\\")
  }

  async fetch(path, callback, props) {
    const request = this.getRequest(path, props)
    await request
    .then((response) => { callback(response.data) })
    .catch((error) => {
      callback({success: false, error})
      this.handleError(error)
    })
  }

  async getRequest(path, props) {
    let pathKey = Object.keys(paths).find(key => paths[key] === path)

    switch (pathKey) {
      case "login":
        return axios.post(path, props.data)

      case "register":
        return axios.post(path, props.data)

      case "cep": 
        let newPath = path.replace(':cep', props.cep)
        return axios.create().get(newPath)

      default:
        console.log(`No path was found for: ${pathKey}`)
        break
    }
  }

  handleError(error) {
    if (!this.debugMode || !error) { return }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
}
