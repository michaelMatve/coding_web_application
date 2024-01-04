
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./Lobby";
import CodePage from "./CodePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/CodePage/:id" element={<CodePage />} />
                <Route path="/" element={<Lobby />} />
                {/* Add other routes here as needed */}
            </Routes>
        </Router>
    );
}

export default App;