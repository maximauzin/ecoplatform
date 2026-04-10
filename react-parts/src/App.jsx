import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authorization from './pages/Authorisation/Authorization';
import SignIn from './pages/Authorisation/SignIn';
import PersonalAccount from './pages/PersonalAccount/PersonalAccount';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authorization />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/personalAccount" element={<PersonalAccount />} />
      </Routes>
    </BrowserRouter>
  );
}