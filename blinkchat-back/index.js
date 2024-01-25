import express from 'express'
import {createServer} from 'node:http'
import {Server} from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)
import mongoose from "mongoose"
import 'dotenv/config'

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection to Mongoose successful'))
    .catch(() => console.log('Connection to Mongoose failed'))

app.get('/', (req, res) => {
    res.status(200).json({message: "hello world"})
})

server.listen(3000, () => {
    console.log("Server running")
})