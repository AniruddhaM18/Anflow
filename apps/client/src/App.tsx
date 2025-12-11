import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Landing } from './pages/Landing';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import { Workflow } from './pages/Workflow';
import DashBoardPage from './pages/Dashboard';
import { CheckEmail } from './pages/CheckEmail';
import { AuthSuccess } from './pages/AuthSuccess';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<Landing />} path='/' />
      <Route element={<SignupPage />} path='/signup' />
      <Route element={<SigninPage />} path='/signin' />
      <Route element={<Workflow />} path='/workflows' />
      <Route element={<Workflow />} path='/workflows/:id' />
      <Route element={<DashBoardPage />} path='/dashboard' />
      <Route element={<CheckEmail />} path='/check-email' />
      <Route element={<AuthSuccess />} path="/auth/success" />

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
