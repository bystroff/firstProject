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

enum Resolutions {P144 = "P144", P240 = "P240", P360 = "P360", P480 = "P480", P720 = "P720", P1080 = "P1080", P1440 = "P1440", P2160 = "P2160"}

const db = {
  videos : [
    {id: 1, 
    title: 'Путь самурая', 
    author: 'IT-KAMASUTRA', 
    canBeDownloaded: false, 
    minAgeRestriction: null, 
    createdAt: '2023-07-06T19:06:28.605Z', 
    publicationDate: '2023-07-06T19:06:28.605Z', 
    availableResolutions: ['P720']},
    {id: 2, 
    title: 'Реальное собеседование Front-end', 
    author: 'Ulbi TV', 
    canBeDownloaded: false, 
    minAgeRestriction: null, 
    createdAt: '2023-07-06T19:06:28.605Z', 
    publicationDate: '2023-07-06T19:06:28.605Z', 
    availableResolutions: ['P240']}
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
  const errorsMessages: Object[] = []
  const title = req.body.title
  const author = req.body.author
  const availableResolutions = req.body.availableResolutions

  if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
    errorsMessages.push({
      'message': 'title is incorrect', 
      'field': 'title'
    })
  }

  if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
    errorsMessages.push({
      'message': 'author is incorrect', 
      'field': 'author'
    })
  }

  if (availableResolutions && !availableResolutions.every((v: string) => Object.keys(Resolutions).includes(v))) {
    errorsMessages.push({
      'message': 'AvailableResolutions is incorrect',
      'field': 'availableResolutions'
    })
  }

  if (errorsMessages.length !== 0) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errorsMessages})
  } else {
    const createdAt = new Date()
    let publicationDate = new Date()
    publicationDate.setDate(publicationDate.getDate() + 1)
    const newVideo = {
      id: +(new Date()),
      title, 
      author,
      availableResolutions, 
      canBeDownloaded: false, 
      minAgeRestriction: null, 
      createdAt: createdAt.toISOString(), 
      publicationDate: publicationDate.toISOString()
    }

    db.videos.push(newVideo)
    res.sendStatus(HTTP_STATUSES.CREATED_201).send(newVideo)
  }  
})

app.get('/:videoId', (req: Request, res: Response) => {
  const video = db.videos.find(v => v.id === +req.params.videoId)
  if (video) {
    res.sendStatus(HTTP_STATUSES.OK_200).send(video)
  } else {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }
})

app.put('/:videoId', (req: Request, res: Response) => {
  const errorsMessages: Object[] = []
  const title = req.body.title
  const author = req.body.author
  const availableResolutions = req.body.availableResolutions
  const canBeDownloaded = req.body.canBeDownloaded
  const minAgeRestriction = req.body.minAgeRestriction
  const publicationDate = req.body.publicationDate

  if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
    errorsMessages.push({
      'message': 'title is required', 
      'field': 'title'
    })
  }

  if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
    errorsMessages.push({ 
      'message': 'author is required', 
      'field': 'author'
    })
  }

  if (availableResolutions && !availableResolutions.every((v: string) => Object.keys(Resolutions).includes(v))) {
    errorsMessages.push({
      'message': 'AvailableResolutions is incorrect',
      'field': 'availableResolutions'
    })
  }

  if (typeof canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
    errorsMessages.push({
      'message': 'CanBeDownloaded is incorrect',
      'field': 'canBeDownloaded'
    })
  }

  if (!minAgeRestriction || typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18) {
    errorsMessages.push({
      'message': 'MinAgeRestriction is incorrect',
      'field': 'minAgeRestriction'
    })
  }

  if (!publicationDate || typeof publicationDate !== 'string' || !publicationDate.trim()) {
    errorsMessages.push({
      'message': 'PublicationDate is incorrect',
      'field': 'publicationDate'
    })
  }

  if (errorsMessages.length > 0) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errorsMessages})
  } else {
    let video = db.videos.find(v => v.id !== +req.params.videoId)
    if (video) {
      video.title = title
      video.author = author
      video.availableResolutions = availableResolutions
      video.canBeDownloaded = canBeDownloaded
      video.minAgeRestriction = minAgeRestriction
      video.publicationDate = publicationDate
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else (
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    )
  }
})

app.delete('/:videoId', (req: Request, res: Response) => {
  const newVideos = db.videos.filter(v => v.id !== +req.params.videoId)
  if (newVideos.length < db.videos.length) {
    db.videos = newVideos
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})