import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Editor from './pages/Editor';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/editor" element={<Editor/>} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
