import { NavLink } from 'react-router-dom'
import logo from '../assets/avito-logo.png'
import './Header.css'

const Header = () => {
    const handleCreateTask = () => {
        const event = new CustomEvent('openTaskModal')
        window.dispatchEvent(event)
    }

    return (
        <header className="header">
            <div className="header-left">
                <NavLink to="/boards" className="header-logo-link">
                    <img src={logo} alt="Avito Logo" className="header-logo" />
                    <span className="header-title">Avito PMS</span>
                </NavLink>
            </div>

            <nav className="header-nav">
                <NavLink
                    to="/boards"
                    end
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Все доски
                </NavLink>
                <NavLink
                    to="/issues"
                    end
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Все задачи
                </NavLink>
            </nav>

            <div className="header-actions">
                <button className="header-button" onClick={handleCreateTask}>
                    Создать задачу
                </button>
            </div>
        </header>
    )
}

export default Header
