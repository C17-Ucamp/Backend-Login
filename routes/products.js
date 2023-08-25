const express = require('express')
const router = express.Router()
const { productsController} = require('../controller')

const {
    getProducts,
    getproductID,
    createProduct,
    updateproduct,
    deleteProduct
} = productsController

router.get('/', async(req,res) =>{
    const products = await getProducts()
    res.send(products)
})

router.get('/:id', async(req,res)=>{
    const product = await getproductID(req.params.id)
    res.send(product)
})

router.post('/', async(req,res) =>{

const body = req.body

try {
    const newProduct = await createProduct(body)
    res.status(201)
    res.send(newProduct)
} catch(error){
    res.status(400)
    return res.send({
        message: "Error de validación",
        reason: error.message
    })
}

})

router.put('/:id', async(req,res)=>{
    const body = req.body
    const {id} = req.params
    const product = await updateproduct(id, body)
    if(!product){
        res.status(404)
        return res.send({
            message: "Prdoucto no fue encontrado"
        })
    }
    res.send(product)
})

router.delete('/:id', async(req,res) =>{
const {id} = req.params;
const result = await deleteProduct(id)
res.send(result)
})

module.exports = router