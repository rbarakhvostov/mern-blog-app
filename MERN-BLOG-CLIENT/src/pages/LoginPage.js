import { useState, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

export default function LoginPage() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('')
  const { setUserInfo } = useContext(UserContext)

  const login = async (e) => {
    e.preventDefault()

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({userName, password}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })

    if (response.ok) {
      response.json().then(({userInfo}) => {
        setUserInfo(userInfo)
        setRedirect(true)
      })
    } else {
      alert('Wrong credentials')
    }
  }

  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="userName"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  )
}
