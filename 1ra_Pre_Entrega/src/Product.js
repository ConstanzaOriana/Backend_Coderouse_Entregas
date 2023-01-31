const fs = require('fs');

class Product{
    pathToFile;
    constructor(pathToFile){
        this.pathToFile = pathToFile;
    }
    async addProduct(title, description, code, price, status=true, stock, category, thumbnail){
        let checkValidator;
        try{
            const dataFile = await this.getData();
            if(title && description && code && price && stock && category){
                checkValidator = true;
                const product = {
                    id : await this.getNewId(),
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnail,
                }
                dataFile.push(product);
                await this.saveFile(this.pathToFile, dataFile);
                console.log(`Product with id ${product.id} added`);
            }else{
                checkValidator = false;
                console.log("ERROR: Require validate fields");
            }
        }
        catch(error){
            console.log(`Error ${error}`);
        }
        finally{
            return checkValidator;
        }
    }
    async addCart(products){
        let checkIfFound;
        try{
            const dataFile = await this.getData();
            if(products){
                checkIfFound = true;
                id = await this.getNewId();
                dataFile.push( { "id":id, ...products });
                await this.saveFile(this.pathToFile, dataFile);
                console.log(`Product with id ${id} added to cart`);
            }else{
                checkIfFound = false;
                console.log("Add operation: Not found");
            }
        }
        catch(error){
            console.log(`Error ${error}`);
        }
        finally{
            return checkIfFound;
        }
    }
    async getData(){
        try{
            const content = await fs.promises.readFile(this.pathToFile, 'utf-8');
            const contentObject = JSON.parse(content);
            return contentObject;
        }
        catch(error){
            console.log(`Error ${error}`);
        }
    }
    async saveFile(path, newContent){
        try{
            const newContentString = JSON.stringify(newContent);
            await fs.promises.writeFile(path, newContentString);
        }
        catch(error){
            console.log(`Error ${error}`);
        }
    }
    async getNewId(){
        try{
            let idMax = 0;
            const dataFile = await this.getData();
            dataFile.forEach(product => {
                if (product.id > idMax) {
                    idMax = product.id;
                }
            });
            return idMax + 1;
        }
        catch(error){
            console.log(`Error ${error}`);
        }
    }
    async getProductById(id){
        console.log(`Search product with id: ${id}`);
        try{
            const dataFile = await this.getData();
            const isFound = dataFile.find(product => product.id == id);
            return isFound ? dataFile[id-1] : "Not found";
        }
        catch(error){
            console.log(`Error ${error}`);
        }
    }
    async updateProduct(id, newProduct){
        let checkIfFound;
        try{
            const dataFile = await this.getData();
            const isFound = dataFile.find(product => product.id == id);
            if(isFound){
                checkIfFound = true;
                const newObj = { "id":id, ...newProduct }
                dataFile[dataFile.findIndex(element => element.id == id)] = newObj;
                await this.saveFile(this.pathToFile, dataFile);
            }else{
                checkIfFound = false;
                console.log("Update operation: Not found");
            }
        }
        catch(error){
            console.log(`Error ${error}`);
        }
        finally{
            return checkIfFound;
        }
    }
    async deleteProduct(id){
        let checkIfFound;
        try {
            const dataFile = await this.getData();
            const isFound = dataFile.find(product => product.id == id);
            if(isFound){
                checkIfFound = true;
                const filterData = dataFile.filter(product => product.id != id) || null;
                await this.saveFile(this.pathToFile, filterData);
            }
            else{
                checkIfFound = false;
                console.log("Delete operation: Not found");
            }
        }
        catch(error){
            console.log(`Error ${error}`);
        }
        finally{
            return checkIfFound;
        }
    }
}

module.exports = { Product };