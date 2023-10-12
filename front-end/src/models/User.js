export default class User {
  id
  email
  name
  endereco
  cep
  profileImage
  userToken
  isLogged
  localStorage

  constructor(localStorage) {
    this.localStorage = localStorage
    this.setup()
  }

  setup() {
    const localUser = JSON.parse(this.localStorage.getItem("user"))
    this.isLogged = localUser !== null
    if (localUser) {
      this.id = localUser._id
      this.email = localUser.email
      this.name = localUser.name
      this.endereco = localUser.endereco
      this.cep = localUser.cep
      this.profileImage = localUser.profileImage
      this.userToken = localUser.userToken
    }
  }

  /**
   * Login method.
   * Basically add to local storage all user properties.
   * @param {user}           user JSON object.
   * 
  */
  async login(user) {
    console.log(user)
    await this.localStorage.setItem("user", JSON.stringify(user))
    this.setup()
  }

  /**
   * Logout method.
  */
  logout() {
    this.localStorage.clear()
    this.id = null
    this.email = null
    this.name = null
    this.endereco = null
    this.cep = null
    this.profileImage = null
    this.userToken = null
    this.isLogged = false
  }
}
