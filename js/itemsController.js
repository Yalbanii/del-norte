class ItemsController {
    constructor(currentId = 0) {
        this.items = [];
        this.currentId = currentId;
    }

    // Método para agregar nuevo producto
    addItem(nombre, cantidad, descripcion, gramajeMin, gramajeMax, precio, imagen, ficha) {
        const item = {
            id: this.currentId++,
            nombre,
            cantidad,
            descripcion,
            gramajeMin,
            gramajeMax,
            precio,
            imagen,
            ficha,
        };

        this.items.push(item);
        this.saveItemsToLocalStorage(); // Guardar en localStorage
        console.log(item);
    }

    // Guardar los items en el almacenamiento local
    saveItemsToLocalStorage() {
        localStorage.setItem("items", JSON.stringify(this.items));
        localStorage.setItem("currentId", this.currentId.toString());
    }

    // Cargar los items desde el almacenamiento local
    loadItemsFromLocalStorage() {
        const storageItems = localStorage.getItem("items");
        const storedId = localStorage.getItem("currentId");

        if (storageItems) {
            this.items = JSON.parse(storageItems);
        }

        if (storedId) {
            this.currentId = parseInt(storedId);
        }
    }
  }
