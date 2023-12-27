import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


{/* <React.StrictMode>
    <App />
  </React.StrictMode> usuwamy StrictMode bo jest przestarzałe i bezużyteczne*/}
