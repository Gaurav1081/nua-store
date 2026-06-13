import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/CartDrawer/CartDrawer';

export default function App() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <CartDrawer />
      <Outlet />
    </>
  );
}
