import { Routes, Route } from "react-router-dom";
import WishMaker from "./components/WishMaker";
import WishOthers from "./components/WishOthers";
import Home from "./components/home.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="make" element={<WishMaker />} />
        <Route path="wish-others" element={<WishOthers />} />
      </Route>
    </Routes>
  );
}
