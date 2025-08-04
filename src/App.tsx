// App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "../Screens/Chat";
import Historial from "../Screens/Historial";
import CalendarView from "../Screens/CalendarView";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                display: "flex",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#0f0f1e",
                fontFamily: "Arial, sans-serif",
                color: "#fff",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  flexBasis: "60%",
                  padding: "2rem",
                  borderRight: "1px solid #333",
                  overflowY: "auto",
                  position: "relative",
                }}
              >
                <Chat />
              </div>

              <div
                style={{
                  flexBasis: "40%",
                  padding: "2rem",
                  overflowY: "auto",
                }}
              >
                <Historial />
              </div>
            </div>
          }
        />
        <Route path="/calendario" element={<CalendarView />} />
      </Routes>
    </Router>
  );
}

export default App;
