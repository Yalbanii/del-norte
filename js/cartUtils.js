window.CartUtils = {
  getCart: function () {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  },
  saveCart: function (car) {
    localStorage.setItem('carrito', JSON.stringify(car));
    if (typeof window.updateCartBadge === 'function') {
      window.updateCartBadge();
    }
  },
  addItem: function (producto, cantidad = 1) {
    const cart = this.getCart();
    const existing = cart.find(p => p.id === producto.id);
    if (existing) {
      existing.cantidad = (existing.cantidad || 0) + cantidad;
      Object.assign(existing, producto);
    } else {
      cart.push({ ...producto, cantidad });
    }
    this.saveCart(cart);
  },
  getCount: function () {
    return this.getCart().reduce((t, p) => t + (p.cantidad || 0), 0);
  }
};
