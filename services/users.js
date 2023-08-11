
const userService = class {
    constructor(userModel){
        this.Model = userModel
    }

    getByEmail(email){
     return this.Model.findOne({email})
    }

    async create(userData){
        const newUser = new this.Model(userData)
        await newUser.save()
         delete newUser.password
        return newUser.toObject()

    }
}

module.exports =userService