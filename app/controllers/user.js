const UserModel = require('../models/UserModel')

class UserController {
  constructor(){
    this.db = [
      {
        id: '0',
        name: 'yokiijay',
        age: 24
      },
      {
        id: '1',
        name: 'robot',
        age: 1
      }
    ]
  }

  async find(ctx){
    ctx.response.body = await UserModel.find()
  }

  findById(ctx){
    const res = this.db.filter(item=>{
      return item.id === ctx.params.id
    })
    ctx.body = res
  }

  put(ctx){
    const {fields} = ctx.request
    this.db = this.db.map(item=>{
      return item.id === ctx.params.id ? Object.assign(item, fields) : item
    })
    ctx.body = fields
  }

  async create(ctx){
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      age: {
        type: 'number',
        required: true
      }
    })
    const res = await new UserModel(ctx.request.body).save()
    ctx.body = res
  }

  deleteById(ctx){
    this.db = this.db.filter(item=>{
      return item.id!==ctx.params.id
    })
    ctx.status = 204
  }
  
}

module.exports = new UserController()