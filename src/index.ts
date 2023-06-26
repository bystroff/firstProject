import express, {Request, Response} from 'express'

export const app = express()
const port = 3000

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
  videos : [
    {id: 1, title: 'Баста', author: 'Вдудь', canBeDownloaded: false, minAgeRestriction: 18, createdAt: ' ', publicationDate: ' ', availableResolutions: []},
    {id: 2, title: 'УУУУУУ', author: 'Майкл Наки', canBeDownloaded: false, minAgeRestriction: 1, createdAt: ' ', publicationDate: ' ', availableResolutions: []},
    {id: 3, title: 'Вечерний выпуск', author: 'Дождь', canBeDownloaded: false, minAgeRestriction: 15, createdAt: ' ', publicationDate: ' ', availableResolutions: []},
    {id: 4, title: 'Путь самурая', author: 'IT-KAMASUTRA', canBeDownloaded: false, minAgeRestriction: 5, createdAt: ' ', publicationDate: ' ', availableResolutions: []},
    {id: 5, title: 'Реальное собеседование Front-end', author: 'Ulbi TV', canBeDownloaded: false, minAgeRestriction: 6, createdAt: ' ', publicationDate: ' ', availableResolutions: []},
    {id: 6, title: 'Урок 1 - Типы данных и их модификаторы', author: 'CSTDIO', canBeDownloaded: false, minAgeRestriction: 8, createdAt: ' ', publicationDate: ' ', availableResolutions: []}
  ]
} 

app.delete('/testing/all-data', (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.get('/videos', (req: Request, res: Response) => {
  res.send(db.videos)
})

app.post('/videos', (req: Request, res: Response) => {
  let title = req.body.title
  let author = req.body.author
  if (!title || typeof title !== 'string' || !title.trim() || title.length > 40 
       || !author || typeof author !== 'string' || !author.trim() || author.length > 20) {
    res.status(400).send({
      errorsMessages: [
        { message: 'title is required', field: 'title'},
        { message: 'author is required', field: 'author'},
      ]
    })
    return
  }

  const newVideo = {
    id: +(new Date()),
    title: 'String', 
    author: 'String', 
    canBeDownloaded: false, 
    minAgeRestriction: 1, 
    createdAt: 'String', 
    publicationDate: 'String', 
    availableResolutions: [ '' ]
  }
  db.videos.push()

  res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
  const id = +req.params.videoId
  const video = db.videos.find(v => v.id === id)
  if (video) {
    res.status(HTTP_STATUSES.OK_200).send(video)
  } else {
    res.send(404)
  }
})

app.put('/videos/:videoId', (req: Request, res: Response) => {
  let title = req.body.title
  let author = req.body.author
  if (!title || typeof title !== 'string' || !title.trim() || title.length > 40
  || !author || typeof author !== 'string' || !author.trim() || author.length > 20) {
    res.status(400).send({
      errorsMessages: [{
        message: 'Incorrect title',
        field: 'title'
      }],
      resultCode: 1
    })
    return
  }

  const id = +req.params.videoId
  const video = db.videos.find(v => v.id === id)
  if (video) {
    video.title = title
    res.status(204).send(video)
  } else {
    res.send(404)
  }
})

app.delete('/videos/:videoId', (req: Request, res: Response) => {
  const id = +req.params.videoId;
  const newVideos = db.videos.filter(v => v.id !== id)
  if (newVideos.length < db.videos.length) {
    db.videos = newVideos
    res.send(204)
  } else {
    res.send(404)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})