class UserController {
  constructor(){
    this.db = [
      {
        id: '0',
        name: 'yokiijay',
        age: '24'
      },
      {
        id: '1',
        name: 'robot',
        age: '1'
      }
    ]
  }

  find(ctx){
    ctx.body = this.db
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

  create(ctx){
    ctx.request.body = ctx.request.fields
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      age: 'string'
    })
    this.db.push({id: (this.db[this.db.length-1].id*1+1).toString(), ...ctx.request.fields})
    ctx.body = ctx.request.fields
  }

  deleteById(ctx){
    this.db = this.db.filter(item=>{
      return item.id!==ctx.params.id
    })
    ctx.status = 204
  }
  
}

module.exports = new UserController()