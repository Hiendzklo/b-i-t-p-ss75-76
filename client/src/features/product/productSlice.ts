import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
}

// Định nghĩa AsyncThunkConfig nếu cần thiết
interface AsyncThunkConfig {
  state: RootState;
  dispatch: any;
  rejectValue: string;
}

export const fetchProducts = createAsyncThunk<Product[], void, AsyncThunkConfig>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/products');
      if (!response.ok) {
        return rejectWithValue('Failed to fetch products');
      }
      const data: Product[] = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: [] as Product[],
  reducers: {
    updateProductQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const index = state.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state[index].quantity = action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      return action.payload;
    });
  },
});

export const { updateProductQuantity } = productSlice.actions;
export default productSlice.reducer;
