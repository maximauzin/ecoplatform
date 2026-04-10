import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authorization from './pages/Authorisation/Authorization';
import SignIn from './pages/Authorisation/SignIn';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authorization />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}