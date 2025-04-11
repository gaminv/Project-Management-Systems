import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import BoardPage from './pages/BoardPage'
import BoardsPage from './pages/BoardsPage'
import IssuesPage from './pages/IssuesPage'
import Header from './components/Header'
import TaskModal from './components/TaskModal'
import { useTaskModal } from './contexts/TaskModalContext'

function App() {
  const { isOpen, selectedTask, closeTaskModal, onSubmit } = useTaskModal()

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/boards" />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="*" element={<Navigate to="/boards" />} />
      </Routes>

      {isOpen && (
        <TaskModal task={selectedTask} onClose={closeTaskModal} onSubmit={onSubmit} />
      )}
    </Router>
  )
}

export default App
