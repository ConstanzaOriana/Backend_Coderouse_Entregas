const { Router } = require('express');
const cartsRouter = Router();
const { Product } = require('../Product');

cartsRouter.post('/', async (req, res) => {
    const data = req.body;
    const instanceManager = new Product('./src/carts.json');
    const checkIfFound = await instanceManager.addCart(data);
    checkIfFound ? res.status(200).send('Product added successfully') : res.status(400).send('Error in  data');
});

cartsRouter.get('/:cid', async (req, res) => {
    const instanceManager = new Product('./src/carts.json');
    const viewCart = await instanceManager.getData();
    const { cid } = req.params;
    const idFound = viewCart.find(element => element.id == cid);
    idFound ? res.status(200).send(idFound) : res.status(404).send('Not Found');
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    let productsCart = req.body;
    let { cid } = req.params;
    cid = parseInt(cid);
    let { pid } = req.params;
    pid = parseInt(pid);
    const instanceManager = new Product('./src/carts.json');
    const viewCart = await instanceManager.getData();
    const cartFound = viewCart.find(element => element.id == cid);
    if(cartFound){
        const productFound = cartFound.products.find(element => element.product == pid);
        let newProductCart = [];
        if(productFound){
            let newQuantity = productsCart.quantity + productFound.quantity
            newProductCart.push( ...cartFound.products );
            newProductCart.map(element => {
                if(element.product == productsCart.product){
                    element.quantity = newQuantity;
                }
            });
        }
        else{
            newProductCart.push( ...cartFound.products );
            newProductCart.push( productsCart );
        }
        const checkIfFound = await instanceManager.updateProduct(cid, { "products": newProductCart });
        checkIfFound ? res.status(200).send('Product modified successfully') : res.status(404).send('Product not Found');
    }
    else{
        res.status(404).send('Product not found');
    }
});

module.exports = cartsRouter;