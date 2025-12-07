import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Landing } from './pages/Landing';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import { Workflow } from './pages/Workflow';
import DashBoardPage from './pages/Dashboard';
// import { Workflow } from './pages/Workflow';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<Landing />} path='/' />
      <Route element={<SignupPage />} path='/signup' />
      <Route element={<SigninPage />} path='/signin' />
      <Route element={<Workflow />} path='/workflow' />
      <Route element={<DashBoardPage />} path='/dashboard' />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
