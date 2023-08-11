# Backend Login

1. Inicia creando una carpeta donde contendrá tu proyecto backend login 
2. Crea un package.json porque descargaremos varias dependencias 
3. Las dependencias a ocupar son : 
- express
- nodemon -D
- cors 
- mongoose 
- bcrypt
- jsonwebtoken 
4. Instancia el servidor con sus respectivos puertos dentro del archivo index.js
``` Javascript
index.js 

const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
require('./db/mongodb')

app.use(express.json())
app.use(cors())


app.get('/', (req,res)=>{
    res.send('Servidor vivo')
})

const PORT = process.env.PORT || 4001
app.listen(PORT, ()=>{
    console.log(`Servidor conectado en ${PORT}`)
})
```
5. Una vez instanciando el puerto, configurando el arranque de nodemon desde el package.json. Crea una carpeta donde contendra un archivo (usualmente llamada db) que contendrá un archivo con nombre mongodb.js
6. Agrega tus credencial para contectarte a la base de datos de Mongodb 
7. En tu carpeta raíz añade una nueva carpeta con el nombre Model. Dentro de esta carpeta, añade un archivo con el nombre de esquema de datos vas a manejar. En este ejemplo le colocaré el nombre de 'users.js'
``` Javascript
Model > users.js
const mongoose = require('mongoose')
const {Schema, model}= mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    lasname: {
        type: String
    },
    username: {
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},{
    versionKey: false,
    timestamps: true
})


const userModel = model('usuarios', userSchema)

module.exports= userModel
```
8. Una vez añadido el modelaje y que la base de datos este correctamente conectada. Crea dentro de la carpeta raíz de tu proyecto una carpeta llamada Services (recuerda que es similar a los controlladores, solo que aquí se provee el servicio de almacenar los datos de usuario).
9. Dentro de esta carpeta contendra un archivo llamado users.js
10. Dentro de este archivo Services > users.js. Instancia una clase constructora, el cúal se va a encargar de crear y guardar los usuarios dentro de tu base datos. 
``` Javascript
services > user.js

const userService = class {
    constructor(userModel){
        this.Model = userModel
    }
    async create(userData){
        const newUser = new this.Model(userData)
        await newUser.save()
        //delete newUser.password
        return newUser.toObject()
    }
}

module.exports = userService
```
11. Una vez realizado la clase constructora de usuarios, crea una carpeta llamada 'apis' y un archivo llamado 'users.js'. Esta contendrá el ruteo de tus endpoints. No te olvides instanciar la clase que acabamos de crear en: Services > users.js, a su vez de enviar los datos de tus rutas con un model.exports, añadidas en un archivo index.js dentro de esta misma carpeta.
``` Javascript
apis > users.js 

const userModel = require('../models/users')
const userService = require('../services/users')

const UserService = new userService(userModel)

router.post('/', async(req,res)=>{
    const body = req.body
    const user = await UserService.create(body)
    console.log(user)
    res.status(200).send(user)
})

module.exports = router
```

``` Javascript
apis > index.js 
const express = require('express')
const router = express.Router()

const userRouter = require('./users')
router.use('/users', userRouter)

module.exports = router
```
12. Localiza tus rutas en el archivo index.js de tu carpeta raíz. No te olvides  que estas rutas las colocas dentro de un middleware el cúal las localizara a todas bajo una ruta es decir: 
``` Javascript
index.js 

const apiRouter = require('./apis')
app.use('/api/v1', apiRouter)
```
13. Realiza las pruebas en tu postman 

## Creación de usuarios: Generar Token y verificar token

14. Una vez comprobado que la ruta y el almacenamiiento de datos esté correcto, se añade al Model la encriptación de datos a través de la libreria de bcrypt 
``` Javascript
Model > users.js 

const bcrypt = require('bcrypt')

userSchema.pre('save', function(next){
 console.log('------>',this.email, this.password)
 const hashedPassword = bcrypt.hashSync(this.password, 12)
 this.password = hashedPassword

 next()
})

const userModel = model('users', userSchema)
module.exports = userModel

```
15. Probamos en consola
16. Ahora, crearemos un archivo  'auth.js', el cúal contendra el código que nos autenticara a lxs usuarixs 
``` Javascript
Services > auth.js

const bcrypt = require('bcryptjs')

const authService = class{
    constructor(userService){
        this.UserService = userService
    }

    async login(email,password){
        const user = await this.UserService.getByEmail(email)

        if(!user){
            throw new Error(`Este usuario no existe`)
        } else if(await bcrypt.compare(password, user.password) || !user){
            return user.toObject();
        } else {
            throw new Error('Inautorizado')
        }
    }
}

module.exports = authService
```
17. No te olvides de regresar a tu archivo Services > users para anexar el getByEmail que vamos a utilizar en el archivo siguiente. Quedando de la siguiente manera: 
``` Javascript

services > user.js

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
        //delete newUser.password
        return newUser.toObject()
    }
}

module.exports = userService
```

17. Crea un archivo 'auth.js' en tu carpeta apis. Ya que se añadira la autenticación a la ruta 

``` Javascript 
apis > auth.js

const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

const userService = require('../services/users')
const userModel = require('../models/users')
const authService = require('../services/auth')

require('dotenv').config()


const UserService = new userService(userModel)
const AuthService = new authService(UserService)
const JWT_SECRET = process.env.JWT_SECRET_PS

router.post('/login', async(req,res)=> {
    
    const {email, password} = req.body
    console.log(req.body)
    try{
        const user = await AuthService.login(email,password)
        console.log(user)
        
             const user = await AuthService.login(email,password)
        console.log(user)
        const userRole = {
            ...user,
            role: 'admin',
            permissions: ['users:me']
        }

        const token = jwt.sign({
            data:  userRole,
            exp:  Math.floor(Date.now() / 1000) + (60 * 60)
        }, JWT_SECRET)
        
        res.send({
        _id: user._id,
        token
        })

        } catch(error){
            console.error(error)
            res.status(401).send({
                message: error.message
            })
        }

})


module.exports = router
```
18. Prueba en consola  que aparezca el _id y el token encriptado 

## Autorización 

19. Crea una carpeta 'Middlewares' con un archivo llamado 'authorization.js'
``` Javascript

middleware > autorization.js 

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET_PS

const authMiddleware = (req,res, next)=>{
    const { authorization } = req.headers 
    console.log(req.headers)
    const token = authorization.split(' ')[1];
 
    try{
     const decoded = jwt.verify(token, JWT_SECRET)
     req.user = decoded.data
     req.permissions = decoded.data.permissions
     const url = req.url.replace(/\//g, ':').slice(1)
     if(req.user.permissions.indexOf(url) === -1){
         return res.status(403).send({
             error: 'tu no pasas, no tienes permisos'
         })
     }
 
     next()
    } catch(error){
  return res.status(403).send({
     error: error.message
  })
    }
 }

module.exports= authMiddleware
```
20. Regresa a tu rachivo index.js donde importaras el archivo 'authMiddleware' el cúal lo añadiras como middleware en tu archivo apis > index.js
``` Javascript
apis > index.js

const userRouter = require('./users')
const authRouter = require('./auth')
const authMiddleware = require('../middleware/authorization')
router.use('/auth', authRouter)

router.use(authMiddleware)
router.use('/users', userRouter)
```

20. Para probar la validación del token regresa al archivo apis > user.js
``` Javascript
apis > user.js 

const express = require('express')
const router = express.Router()
const userModel = require('../models/users')
const userService = require('../services/users')

const UserService = new userService(userModel)

router.get('/me', async(req,res)=>{
    const sessionUser = req.user 

    if(!sessionUser){
        return res.status(403).send({
            message: 'Tu no deberías de estar aqui'
        })
    }

    res.send({
        name: sessionUser.name,
        email: sessionUser.email
    })
})


router.post('/', async(req,res)=>{
    const body = req.body
    const user = await UserService.create(body)
    console.log(user)
    res.status(200).send(user)
})

module.exports = router
```
21. Prueba la autorización en el postman 

## ¡Haz la prueba!
 ## No te olvides que las rutas son estas: 
  ```
  //Acceder al login:
  http://localhost:4003/api/v1/auth/login

  //Verificación del login
  http://localhost:4003/api/v1/users/me
  ```