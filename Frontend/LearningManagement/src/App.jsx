import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import Header from "./components/Header";
// import Home from "./pages/Home";
import CourseManager from "./pages/CourseManager";
import CourseDetails from "./pages/CourseDetails"; // we'll make this next

function App() {
  return (
    <Router>
        <div className="min-h-screen">
          {/* <Header /> */}
          <main className="flex-grow">
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path='/managecourse' element={<CourseManager />} />
              <Route path="/course/:id" element={<CourseDetails />} />
            </Routes>
          </main>
        </div>
    </Router>
  );
}

export default App;
