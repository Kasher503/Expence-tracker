// store.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Initial state (if needed)
const initialState = {
  things: [],
  income: 0,
  expense: 0,
  balance: 0
};

// Reducer function
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        things: [...state.things, action.payload],
        income: state.income + (action.payload.price >= 0 ? action.payload.price : 0),
        expense: state.expense + (action.payload.price < 0 ? Math.abs(action.payload.price) : 0),
        balance: state.balance + action.payload.price
      };
    case 'DELETE_TRANSACTION':
      const itemToDelete = state.things.find(item => item.id === action.payload);
      return {
        ...state,
        things: state.things.filter(item => item.id !== action.payload),
        income: state.income - (itemToDelete?.price >= 0 ? itemToDelete.price : 0),
        expense: state.expense - (itemToDelete?.price < 0 ? Math.abs(itemToDelete.price) : 0),
        balance: state.balance - (itemToDelete?.price || 0)
      };
    case 'CLEAR_TRANSACTIONS':
      return {
        ...state,
        things: [],
        income: 0,
        expense: 0,
        balance: 0
      };
    default:
      return state;
  }
};

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
