import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Landing } from './pages/Landing';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import { Workflow } from './pages/Workflow';
import DashBoardPage from './pages/Dashboard';
import { CheckEmail } from './pages/CheckEmail';
import { AuthSuccess } from './pages/AuthSuccess';
import { ProtectedRoute } from './pages/Auth/ProtectedRoute';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<Landing />} path='/' />
      <Route element={<SignupPage />} path='/signup' />
      <Route element={<SigninPage />} path='/signin' />
      <Route element={<CheckEmail />} path='/check-email' />
      <Route element={<AuthSuccess />} path="/auth/success" />

      <Route
  path="/workflows"
  element={
    <ProtectedRoute>
      <Workflow />
    </ProtectedRoute>
  }
/>

<Route
  path="/workflows/:id"
  element={
    <ProtectedRoute>
      <Workflow />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashBoardPage />
    </ProtectedRoute>
  }
/>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
