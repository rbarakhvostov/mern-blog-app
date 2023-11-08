import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "./UserContext"

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext)
  const userName = userInfo?.userName

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include'
    })
    .then(resp => resp.json())
    .then(({userInfo}) => setUserInfo(userInfo))
  }, [setUserInfo])

  const logout = () => {
    fetch('http://localhost:4000/profile', {
      method: 'POST',
      credentials: 'include'
    })

    setUserInfo(null)
  }

  return (
    <header>
      <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {userName ? (
          <>
            <Link to="/create">Create new article</Link>
            <a href="#" onClick={logout}>Logout</a>
          </>
        ): (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
        )}
      </nav>
    </header>
  )
}
