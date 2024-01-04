
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./Lobby";
import CodePage from "./CodePage";
/*
This is the main app. It is responsible for routing the client to other pages.

*/
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/CodePage/:id" element={<CodePage />} />
                <Route path="/" element={<Lobby />} />
            </Routes>
        </Router>
    );
}

export default App;