import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Post({
  _id,
  title,
  summary,
  content,
  cover,
  createdAt,
  author: { userName }
}) {
  return (
    <div className="post">
      <Link to={`/post/${_id}`}>
        <img src={`http://localhost:4000/${cover}`} alt="" />
      </Link>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author" href="#">{userName}</a>
          <time>{format(new Date(createdAt), 'MMM d, yyy HH:mm')}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  )
}