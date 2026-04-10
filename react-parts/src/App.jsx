import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authorization from './pages/Authorisation/Authorization';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authorization />} />
      </Routes>
    </BrowserRouter>
  );
}