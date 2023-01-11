
const UserModel = require('../models/User.mongo')

class UserController {

  async getAll() {

    try {

      let result = await UserModel.find()
      return {status:'OK', result};             

    } catch (error) {

      return {status:'ERROR', result: error.message};             
    }
  }

}

module.exports = new UserController();