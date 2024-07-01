import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';

function App() {
  return (
    <Provider store={store}>
      <div className="container mx-auto p-4 flex">
        <div className="w-1/2 pr-4">
          <ProductList />
        </div>
        <div className="w-1/2 pl-4">
          <ShoppingCart />
        </div>
      </div>
    </Provider>
  );
}

export default App;
