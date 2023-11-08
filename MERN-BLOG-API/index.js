const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const UserModel = require('./models/UserModel')
const PostModel = require('./models/PostModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const fs = require('fs')

const app = express()

const salt = bcrypt.genSaltSync(10)
const secret = 'qwerty12345'

const uploadMiddleware = multer({ dest: 'uploads/' })

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

mongoose
  .connect('mongodb+srv://rbarakhvostov:uMcWEOOMm7MNbZ2u@cluster0.5dmwdsw.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to MongoDB')

    app.listen(4000, () => {
      console.log('app is running on port 4000')
    })
  })
  .catch((err) => console.log(err))

app.post('/register', async (req, res) => {
  try {
    const {userName, password} = req.body
    const userData = await UserModel.create({
      userName,
      password: bcrypt.hashSync(password, salt)
    })
    res.json(userData)
  } catch(e) {
    res.status(400).json(e)
  }
})

app.post('/login', async (req, res) => {
  const {userName, password} = req.body
  const userData = await UserModel.findOne({userName})
  const isPasswordOk = bcrypt.compareSync(password, userData?.password)

  if (isPasswordOk) {
    jwt.sign({userName, id: userData._id}, secret, {}, (err, token) => {
      if (err) {
        throw err
      }

      res.cookie('token', token).json({
        id: userDoc._id,
        userName        
      })
    })
  } else {
    res.status(400).json('Wrong credentials')
  }
})

app.get('/profile', (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      throw err
    }

    res.json(info)
  })
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('Ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file
  const ext = originalname.split('.').at(-1)
  const newPath = path + '.' + ext
  fs.renameSync(path, newPath)

  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      throw err
    }

    const { title, summary, content } = req.body

    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id
    })

    res.json(postDoc)
  })
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null

  if (req.file) {
    const { originalname, path } = req.file
    const ext = originalname.split('.').at(-1)
    newPath = path + '.' + ext
    fs.renameSync(path, newPath)
  }

  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      throw err
    }

    const { id, title, summary, content } = req.body
    const postDoc = await Post.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)

    if (!isAuthor) {
      return res.status(400).json('you are not the author')
    }

    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover
    })

    res.json(postDoc)
  })
})

app.get('/posts', async (req, res) => {
  const posts = await PostModel
    .find()
    .populate('author', ['userName'])
    .sort({ createdAt: -1 })
    .limit(20)

  res.json(posts)
})

app.get('/post/:id', async (req, res) => {
  const { id } = req.params
  const post = await PostModel.findById(id).populate('author', [userName])

  res.json(post)
})
