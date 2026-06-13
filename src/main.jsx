import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CartProvider } from './stores/CartContext';
import { UIProvider } from './stores/UIContext';
import { router } from './router/index';
import './styles/global.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </UIProvider>
  </StrictMode>
);
