import './App.css'
import WorkflowPage from './draft';
import { DashboardPage } from './pages/Dashboard';
import { HomePage } from './pages/Home'
import { Workflow } from './pages/Workflow'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<HomePage />} path='/home' />
      <Route element={<DashboardPage />} path='/dashboard' />
      <Route element={<Workflow />} path='/workflow' />
      <Route element={<WorkflowPage />} path='/test' />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
