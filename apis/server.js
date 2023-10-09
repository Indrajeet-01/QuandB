import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/user', userRoutes)



app.listen(5000, ()=>{
    console.log("server is running!")
})