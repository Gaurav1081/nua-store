import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ProductListing from '../pages/ProductListing';
import ProductDetail from '../pages/ProductDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProductListing /> },
      { path: 'product/:id', element: <ProductDetail /> },
    ],
  },
]);
