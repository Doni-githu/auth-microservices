import amqp from "amqplib"
import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import AuthRoutes from "./routes/user"
import Token from "./utils/token"
import User from "./models/user"
import { IUser } from "./interfaces/user.interface"
dotenv.config()
const app = express()



app.use(express.json())

app.use('/api/auth', AuthRoutes)

// async function ConsumeReq() {
//     const amqpServer = "amqp://localhost"

//     const connection = await amqp.connect(amqpServer)
//     const channel = await connection.createChannel()

//     await channel.assertExchange('logger', 'direct')

//     let q = await channel.assertQueue('InfoQueue')
//     await channel.bindQueue(q.queue, 'logger', "Rush")
//     await channel.consume(q.queue, async (msg) => {
//         const user = JSON.parse(msg.content.toString())
//         let result = Token.decode(user.token)
//         if (result?.payload) {
//             let result2 = await User.findById<IUser>(result.payload)
//             let data = {
//                 status: 200,
//                 user: result2
//             }
//             channel.publish('logger', 'Receive', Buffer.from(JSON.stringify(data)))
//             channel.ack(msg)
//         }
//     })
// }


// ConsumeReq()

function Run(): void {
    const PORT = process.env.PORT || 8000
    mongoose.connect(process.env.MONGO_GLOBAL_URI)
        .then((res) => console.log('Mongo DB connect in auth service'))
        .catch((err) => console.log(`Mongo DB could not connected in auth service, because ${err}`))
    app.listen(PORT, () => {
        console.log(`Auth-service running on port ${PORT}`)
    })
}

Run()