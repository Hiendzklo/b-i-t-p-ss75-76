import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCart, removeFromCart, CartItem } from '../features/cart/cartSlice';
import { RootState, AppDispatch } from '../app/store';
import Notification from './Notification';
import Modal from './Modal';
import { updateProductQuantity } from '../features/product/productSlice';

const ShoppingCart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  const products = useSelector((state: RootState) => state.products);
  const [notification, setNotification] = useState<{ type: 'success' | 'update' | 'delete', message: string } | null>(null);
  const [quantityInput, setQuantityInput] = useState<{ [key: number]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdate = (id: number, quantity: number) => {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      const product = products.find(product => product.id === id);
      if (product && quantity <= product.quantity + cartItem.quantity) {
        dispatch(updateCart({ id, quantity }));
        dispatch(updateProductQuantity({ id, quantity: product.quantity - (quantity - cartItem.quantity) }));
        setNotification({ type: 'update', message: 'Update product successfully' });
      } else {
        setNotification({ type: 'update', message: 'Not enough stock' });
      }
    }
  };

  const handleRemove = () => {
    if (itemToRemove) {
      const product = products.find(product => product.id === itemToRemove.id);
      if (product) {
        dispatch(updateProductQuantity({ id: itemToRemove.id, quantity: product.quantity + itemToRemove.quantity }));
        dispatch(removeFromCart({ id: itemToRemove.id }));
        setNotification({ type: 'delete', message: 'Delete product successfully' });
      }
      setItemToRemove(null);
      setShowModal(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setQuantityInput(prev => ({ ...prev, [id]: quantity }));
  };

  const handleUpdateClick = (id: number) => {
    if (quantityInput[id] !== undefined) {
      handleUpdate(id, quantityInput[id]);
    }
  };

  const openModal = (item: CartItem) => {
    setItemToRemove(item);
    setShowModal(true);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {notification && <Notification type={notification.type} message={notification.message} onClose={closeNotification} />}
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Empty product in your cart</p>
      ) : (
        cart.map(item => (
          <div key={item.id} className="border rounded-lg p-4 mb-4 flex">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
            <div className="flex-grow">
              <h3 className="text-xl font-medium">{item.name}</h3>
              <p className="text-gray-900 font-semibold">Price: ${item.price}</p>
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  value={quantityInput[item.id] !== undefined ? quantityInput[item.id] : item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  className="border rounded-lg p-1 w-16 mr-2"
                  min="1"
                />
                <button
                  onClick={() => handleUpdateClick(item.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </div>
            <button
              onClick={() => openModal(item)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))
      )}
      {cart.length > 0 && <h3 className="text-xl font-semibold">Subtotal: ${total}</h3>}
      {showModal && itemToRemove && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleRemove}
          title="Xác nhận"
          message="Bạn có chắc chắn xóa sản phẩm khỏi giỏ hàng?"
        />
      )}
    </div>
  );
};

export default ShoppingCart;
