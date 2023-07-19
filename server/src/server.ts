import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import router from './router'
import { checkAuthorization } from './utils/auth'

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "welcome to my server" })
})

app.use('/api', checkAuthorization, router)

export default app
