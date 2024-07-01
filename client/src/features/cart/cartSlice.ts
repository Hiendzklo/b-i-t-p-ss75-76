import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Product } from '../product/productSlice';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Định nghĩa AsyncThunkConfig nếu cần thiết
interface AsyncThunkConfig {
  state: RootState;
  dispatch: any;
  rejectValue: string;
}

export const fetchCart = createAsyncThunk<CartItem[], void, AsyncThunkConfig>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/cart');
      if (!response.ok) {
        return rejectWithValue('Failed to fetch cart');
      }
      const data: CartItem[] = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue('Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk<CartItem, CartItem, AsyncThunkConfig>(
  'cart/addToCart',
  async (item, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const existingItem = state.cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      // Update the quantity of the existing item in the cart
      const response = await fetch(`http://localhost:8080/cart/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: existingItem.quantity + item.quantity }),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to update cart item');
      }
      const data: CartItem = await response.json();
      return data;
    } else {
      // Add new item to the cart
      const response = await fetch('http://localhost:8080/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to add item to cart');
      }
      const data: CartItem = await response.json();
      return data;
    }
  }
);

export const updateCart = createAsyncThunk<CartItem, { id: number; quantity: number }, AsyncThunkConfig>(
  'cart/updateCart',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/cart/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        return rejectWithValue('Failed to update cart item');
      }
      const data: CartItem = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue('Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk<number, { id: number }, AsyncThunkConfig>(
  'cart/removeFromCart',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/cart/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        return rejectWithValue('Failed to remove item from cart');
      }
      return id;
    } catch (err) {
      return rejectWithValue('Failed to remove item from cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as CartItem[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
      return action.payload;
    });
    builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
      const item = state.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      } else {
        state.push(action.payload);
      }
    });
    builder.addCase(updateCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[index].quantity = action.payload.quantity;
      }
    });
    builder.addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
      return state.filter(item => item.id !== action.payload);
    });
  },
});

export default cartSlice.reducer;
