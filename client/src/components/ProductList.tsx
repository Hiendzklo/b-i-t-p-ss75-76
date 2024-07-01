import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, updateProductQuantity } from '../features/product/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { RootState, AppDispatch } from '../app/store';
import Notification from './Notification';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products);
  const cart = useSelector((state: RootState) => state.cart);
  const [notification, setNotification] = useState<{ type: 'success' | 'update' | 'delete', message: string } | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product: any) => {
    const cartItem = cart.find(item => item.id === product.id);
    const newQuantity = cartItem ? cartItem.quantity + 1 : 1;
    if (product.quantity >= newQuantity) {
      dispatch(addToCart({ ...product, quantity: 1 }));
      dispatch(updateProductQuantity({ id: product.id, quantity: product.quantity - 1 }));
      setNotification({ type: 'success', message: 'Add product successfully' });
    } else {
      setNotification({ type: 'update', message: 'Not enough stock' });
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">List Product</h2>
      {notification && <Notification type={notification.type} message={notification.message} onClose={closeNotification} />}
      {products.map(product => (
        <div key={product.id} className="border rounded-lg p-4 mb-4 flex">
          <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
          <div className="flex-grow">
            <h3 className="text-xl font-medium">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-900 font-semibold">Price: ${product.price}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-700">Total: {product.quantity}</span>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.quantity === 0}
                className={`px-4 py-2 rounded-lg text-white ${
                  product.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
