import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";   // <-- ADD
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer"
function App() {
  return (
    <Routes>
      <Route path="/dealer/:id" element={<Dealer/>} />
      <Route path="/dealers" element={<Dealers/>} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default App;
