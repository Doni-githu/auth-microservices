"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const token_1 = __importDefault(require("./utils/token"));
const user_2 = __importDefault(require("./models/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', user_1.default);
async function ConsumeReq() {
    const amqpServer = "amqp://localhost";
    const connection = await amqplib_1.default.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertExchange('logger', 'direct');
    let q = await channel.assertQueue('InfoQueue');
    await channel.bindQueue(q.queue, 'logger', "Rush");
    await channel.consume(q.queue, async (msg) => {
        const user = JSON.parse(msg.content.toString());
        let result = token_1.default.decode(user.token);
        if (result?.payload) {
            let result2 = await user_2.default.findById(result.payload);
            let data = {
                status: 200,
                user: result2
            };
            channel.publish('logger', 'Receive', Buffer.from(JSON.stringify(data)));
            channel.ack(msg);
        }
    });
}
ConsumeReq();
function Run() {
    const PORT = process.env.PORT || 8000;
    mongoose_1.default.connect(process.env.MONGO_GLOBAL_URI)
        .then((res) => console.log('Mongo DB connect in auth service'))
        .catch((err) => console.log(`Mongo DB could not connected in auth service, because ${err}`));
    app.listen(PORT, () => {
        console.log(`Auth-service running on port ${PORT}`);
    });
}
Run();
//# sourceMappingURL=index.js.map