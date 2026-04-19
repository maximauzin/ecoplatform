import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authorization from './pages/Authorisation/Authorization';
import SignIn from './pages/Authorisation/SignIn';
import PersonalAccount from './pages/PersonalAccount/PersonalAccount';
import FavoriteList from './pages/FavoriteList/FavoriteList';
import MyPointsList from './pages/MyPointsList/MyPointsList';
import MainMap from './pages/MainMap/MainMap';
import MainAnonim from './pages/MainAnonim/MainAnonim';
import CardPoint from './pages/CardPoint/CardPoint';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authorization />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/personalAccount" element={<PersonalAccount />} />
        <Route path='/favoriteList' element={<FavoriteList />} />
        <Route path='/myPointsList' element={<MyPointsList />} />
        <Route path='/main' element={<MainMap />} />
        <Route path='/mainAnonim' element={<MainAnonim />} />
        <Route path='/cardId1' element={<CardPoint />} />
      </Routes>
    </BrowserRouter>
  );
}