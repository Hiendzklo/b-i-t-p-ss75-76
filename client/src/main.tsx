import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Đảm bảo rằng bạn nhập file CSS của Tailwind
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // ! đảm bảo rằng container không phải null

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
