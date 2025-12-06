import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Landing } from './pages/Landing';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import { Dashboard } from './pages/Dashboard';
import { FlowPage } from './pages/Flow';
// import { Workflow } from './pages/Workflow';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<Landing />} path='/' />
      <Route element={<SignupPage />} path='/signup' />
      <Route element={<SigninPage />} path='/signin' />
      <Route element={<Dashboard />} path='/dashboard' />
      <Route element={<FlowPage />} path='/flow' />
    </Routes>
    </BrowserRouter>
   
    </>
  )
}

export default App
