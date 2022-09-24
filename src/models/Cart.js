
import * as fs from 'fs';

export default class Cart {

  constructor(archivo){    
    this.archivo = archivo;    
  }
  
  addCart = async (obj) => {
    try {
      if(fs.existsSync(this.archivo)){
        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
        
        let id = data.length === 0 ? 1 : data[data.length - 1].id+1;
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

  getById = async (id) => { 
    try {
      if(fs.existsSync(this.archivo)){
        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
        let obj = data.find(c => c.id === parseInt(id));

        if(!obj) return {status: 'ERROR', result: `Carrito ID: ${id} no existe`}

        let productos = obj.productos;        
        return {status: 'OK', result: productos}

      }else {
        return {status:'ERROR', result: `Carrito ID: ${id} no existe`}
      }      
    } catch (error) {
      return {status:'ERROR', result: error.message}
    }
  }

  addProductsToCart = async (id, products) => {
    try {
      if(fs.existsSync(this.archivo)){
        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
        let obj = data.find(c => c.id === parseInt(id));
        
        products.productos.forEach(p => obj.productos.push(p));
        console.log(obj.productos);

        await fs.promises.writeFile(this.archivo,JSON.stringify(data,null,2))     
        return {status:'OK', result: `Productos agregados al carrito ID: ${id}`}   
      } else {
        return {status:'ERROR', result: `Carrito ID: ${id} no existe`}
      }
    } catch (error) {
      return {status:'ERROR', result: error.message}
    }
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

  deleteById = async (id) => {
    try {
      if(fs.existsSync(this.archivo)){
        let arch = fs.readFileSync(this.archivo, 'utf-8'); 
        let data = JSON.parse(arch);
  
        let existe = data.some(p => p.id === parseInt(id));
        if(!existe) return {status: "ERROR", result: `Producto ID ${id} no existe`}
  
        data = data.filter( (item) => item.id !== parseInt(id));      
        data = JSON.stringify(data,null,2);
        fs.writeFileSync(this.archivo, data);  

        return {status: "OK", result: `Producto ID ${id} eliminado`}
      }
    } catch (error) {
      return {status: 'ERROR', result: error.message}
    }
  }

  updateProduct = async (id, obj) => {
    try {
      if(fs.existsSync(this.archivo)){
        let arch = await fs.promises.readFile(this.archivo, 'utf-8');
        let data = JSON.parse(arch);
        let prod = data.find(p => p.id === parseInt(id));                

        if(prod) {
          prod.nombre = obj.nombre;
          prod.descripcion = obj.descripcion;
          prod.codigo = obj.codigo;
          prod.foto = obj.foto;
          prod.precio = obj.precio;
          prod.stock = obj.stock;
  
          await fs.promises.writeFile(this.archivo,JSON.stringify(data,null,2))
          return {status: 'OK', result: `Producto ID: ${id} actualizado`}; 
        }else {
          return {status: 'ERROR', result: `Producto ID: ${id} no existe`}; 
        }
      }else {
        return {status: 'ERROR', result: 'No existe el archivo productos.txt'}; 
      }
    } catch (error) {
      return {status: 'ERROR', result: error.message}
    }
  }

  //TODO: hacer metodo para calcular total del carrito
}