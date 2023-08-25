const ProductModel = require('../model/products')

const getProducts = async() =>{
    const products = await ProductModel.find({})
    return products
}

const getproductID = async(_id) =>{
    return await ProductModel.findById(_id);
}

const createProduct = async(product) =>{
const newProduct = new ProductModel(product)
return newProduct.save()
}

const updateproduct = async(_id, product) =>{
return await ProductModel.findByIdAndUpdate({_id}, product ,{
upsert: false,
new:true
})
}

const deleteProduct = async(_id) =>{
    return await ProductModel.findByIdAndDelete(_id)
}

module.exports = {
    getProducts,
    getproductID,
    createProduct,
    updateproduct,
    deleteProduct
}