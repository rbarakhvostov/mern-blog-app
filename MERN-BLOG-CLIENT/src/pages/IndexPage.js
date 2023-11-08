import { useState, useEffect } from 'react'
import Post from "../Post"

export default function IndexPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('http://localhost:4000/posts')
      .then(resp => resp.json())
      .then(posts => setPosts(posts))
  }, [])

  return (
    <>
      {posts.map(post => <Post {...post} />)}
    </>
  )
}
