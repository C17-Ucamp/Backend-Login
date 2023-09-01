const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const {updateUser} = require('../controller/changeController')

router.put('/change', async(req,res)=>{
    const {oldPassword, newPassword} = req.body
    const sessionUser = req.user
    const id = sessionUser._id

    if(!sessionUser){
        return res.status(403).send({
            message: 'Tu no deberias estar aquí'
        })
    }

    const isPassWordMatch = bcrypt.compareSync(oldPassword, sessionUser.password)

    if(!isPassWordMatch){
        return res.status(401).send({
            messsage: "La contraseña actual es incorrecta, por el momento no la puedes modificar"
        })
    } else {
        await updateUser(id, newPassword);

        res.send({
            message: "Se cambio la contraseña",
            newPassword: newPassword
        })
    }
})

module.exports = router