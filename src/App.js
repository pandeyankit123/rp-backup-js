import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import State from './context/state';
import Alert from './components/Alert';
import Footer from './components/Footer';
import { useState } from 'react';
import LoginSignup from './components/loginsignup/LoginSignup';
import Navbar from './components/Navbar';
import Studs from './components/Studs/Studs';
import Result from './components/Result';

function App() {
  const [alert, setAlert] = useState(null)
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }

  return (
    <>
      <State>
        <Router>
          <div style={{ minHeight: "100vh" }}>
          <Navbar showAlert={showAlert}/>
            <Alert alert={alert} />
            <Routes>
              <Route exact path="/" element={<LoginSignup showAlert={showAlert} />} />
              <Route exact path="/studs" element={<Studs showAlert={showAlert} />} />
              <Route exact path="/result" element={<Result showAlert={showAlert} />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </State>
    </>
  );
}

export default App;