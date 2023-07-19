import * as dotenv from 'dotenv'
dotenv.config()
import app from './server'

const port = process.env.PORT

app.listen(port, ()=> {
    console.log(`server is running at http://localhost:${port}`)
})
