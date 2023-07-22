import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import router from './router'
import { checkAuthorization } from './utils/auth'
import { createMember, logMemberIn } from './handlers/member'

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "welcome to my server" })
})
// member auth paths
app.post('/createMember', createMember);
app.post('/loginMember', logMemberIn);
// auth-required paths
app.use('/api', checkAuthorization, router)

export default app
