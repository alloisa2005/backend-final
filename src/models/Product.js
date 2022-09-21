
import * as fs from 'fs';

export default class Product {

  constructor(archivo){    
    this.archivo = archivo;    
  }
  
  getAll = async () => {
    try {
      if(fs.existsSync(this.archivo)){

        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
              
        return {status: 'OK', result: data};

      }else {
        return {status: 'OK', result: []}
      }      

    } catch (error) {
      return {status: 'ERROR', result: error.message}
    }
  }

  getById = async (id) => {
    try {
      if(fs.existsSync(this.archivo)){
        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
        let obj = data.find( (item) => item.id === parseInt(id));

        if(obj) return {status: 'OK', result: obj};

        return {status:'ERROR', result:`No existe el producto ID ${id}`}
        
      }else {
        return {status:'ERROR', result:`No existe el producto ID ${id}`}
      }      
    } catch (error) {
      return {status:'error', result: error.message}
    }
  }

  addProduct = async (obj) => {
    try {
      if(fs.existsSync(this.archivo)){
        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
        let id = data[data.length - 1].id+1;
        obj.id = id;
        data.push(obj);
        await fs.promises.writeFile(this.archivo,JSON.stringify(data,null,2))
        return {status: "OK", result: obj.id}
      }else {
        obj.id = 1
        await fs.promises.writeFile(this.archivo, JSON.stringify([obj], null, 2))
        return {status: "OK", result: obj.id}
      }
    } catch (error) {
      return {status: 'ERROR', result: error.message}
    }
  }
}