import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Editor from '../Editor'

export default function PostCreation() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const [redirect, setRedirect] = useState(false)

  const createPost = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('file', files[0])

    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include'
    })

    if (response.ok) {
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to='/' />
  }

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />
      <input
        type="file"
        onChange={e => setFiles(e.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop: '10px'}}>Create post</button>
    </form>
  )
}
