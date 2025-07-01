
class ItemsController {
    constructor(currentId = 0) {
        this.items = [];
        this.currentId = currentId;
  }

    //Metodo addItem
    addItem(nombre, cantidad, descripcion, gramajeMin, gramajeMax, precio, imagen, ficha) {
        const item = {
            id: this.currentId++,
            nombre: nombre,
            cantidad: cantidad,
            descripcion: descripcion,
            gramajeMin: gramajeMin,
            gramajeMax: gramajeMax,
            precio: precio,
            imagen: imagen,
            ficha: ficha,
        };

        this.items.push(item);
        console.log(item);
    }
     loadItemsFromLocalStorage() {
        const storageItems = localStorage.getItem("items")
        if (storageItems) {
            const items = JSON.parse(storageItems)
            for (var i = 0, size = items.length; i < size; i++) {
                const item = items[i];
                this.items.push(item);
            }
        }
    }
  }
  
