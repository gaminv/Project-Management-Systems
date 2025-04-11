import { Link } from 'react-router-dom'
import { useBoards } from '../api/boards'
import './BoardsPage.css'

const BoardsPage = () => {
    const { data: boards, isLoading, error } = useBoards()

    if (isLoading) return <div className="page-wrapper">Загрузка досок...</div>
    if (error) return <div className="page-wrapper">Ошибка загрузки досок</div>

    return (
        <div className="page-wrapper">
            <h2 className="issues-title">Все доски</h2>

            <div className="issues-list">
                {boards?.map(board => (
                    <Link
                        key={board.id}
                        to={`/boards/${board.id}`}
                        className="issues-item board-link"
                    >
                        <div className="task-title">{board.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default BoardsPage
