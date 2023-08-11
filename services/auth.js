const bcrypt = require('bcrypt')

const authService = class{
    constructor(userService){
        this.UserService = userService
    }

    async login(email,password){
        const user = await this.UserService.getByEmail(email)
        if (user) {

            const isPasswordMatch = await this.bcrypt.compare(password, user.password);
      
            if (isPasswordMatch) {
              return user.toObject();
            } else {
              throw new Error('La contraseña es incorrecta');
            }
          } else {
            throw new Error('El usuario no existe');
          }
    }

    
}

module.exports = authService