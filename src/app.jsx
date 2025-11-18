import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import AnimeDetailsPage from "./Pages/AnimeDetails.jsx";
import BrowsePage from "./Pages/Browse.jsx";
import CookiesPolicy from "./Pages/CookiesPolicy.jsx";
import HomePage from "./Pages/Home.jsx";
import MangaPage from "./Pages/Manga.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import ProfilePage from "./Pages/Profile.jsx";
import WatchPage from "./Pages/Watch.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/anime-details" element={<AnimeDetailsPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/manga" element={<MangaPage />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
         <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Layout>
  );
}
