import bodyParser from 'body-parser'
import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import cors from 'cors'

const kravaChId = '-1002049110612'
const pengvChId = '-1002002202731'

const bd = {
    users: [],
    connected_channels: [],
    keys: [],
    socials: [],
    connected_socials: []
}

const PORT = 8000;

const token = '6626581855:AAG-pTzv_75p_6UT_3hrUZBiJ_-rYfA9bME';

const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(cors());

// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//
//     // Pass to next layer of middleware
//     next();
// });

app.use(bodyParser.json())

app.use(
    bodyParser.urlencoded({
      extended: true,
    })
)

app.get('/health', (request, response) => {
  response.json({ info: 'Working correct' })
})

bot.on('my_chat_member', async (msg) => {
    // const canInviteUsers = msg.new_chat_member.can_invite_users
    // const canRestrictMembers = msg.new_chat_member.can_restrict_members
    //
    // if (msg.chat.type !== 'channel') {
    //     await bot.sendMessage(fromId, 'Бота нужно добавить в канал, а не в чат')
    //     return
    // }
    //
    // if (!canInviteUsers || !canRestrictMembers) {
    //     await bot.sendMessage(fromId, 'У бота недостаточно прав, ему нужны права на добавление и удаление юзеров')
    //     return
    // }
    if (bd.connected_channels.filter((item) => item.channel_id === chatId).length !== 0) {
        bd.connected_channels = bd.connected_channels.filter((item) => item.channel_id !== chatId)
        return
    }

    bd.connected_channels.push({
        channel_id: msg.chat.id,
        telegram_id: msg.from.id
    })
    // if(text === '/start') {
    //     await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
    //         reply_markup: {
    //             keyboard: [
    //                 [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
    //             ]
    //         }
    //     })
    //
    //     await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
    //         reply_markup: {
    //             inline_keyboard: [
    //                 [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
    //             ]
    //         }
    //     })
    // }

    // if(msg?.web_app_data?.data) {
    //     try {
    //         const data = JSON.parse(msg?.web_app_data?.data)
    //         console.log(data)
    //         await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
    //         await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
    //         await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);
    //
    //         setTimeout(async () => {
    //             await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
    //         }, 3000)
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
});

bot.on('chat_join_request', async (msg) => {
    const userId = msg.from.id
    const chatId = msg.chat.id

    await bot.approveChatJoinRequest(chatId, userId)
    await bot.declineChatJoinRequest(chatId, userId)
})

app.post('/update_user', async (req, res) => {
    const { telegram_id, username, wallet_address, private_channel_id } = req.body;
    try {
        // Найти пользователя по адресу кошелька
        let user = bd.users.find((item) => item.wallet_address === wallet_address);

        if (user) {
            // Проверка, изменилось ли хотя бы одно поле
            //TODO: Нужно обработывать случай если телеграм айди новый то ничего не менять и не давать ваще юзеру пользоваться приложением
            const isChanged = user.telegram_id !== telegram_id ||
                user.username !== username ||
                user.private_channel_id !== private_channel_id;

            if (isChanged && private_channel_id) {
                // Обновление данных пользователя
                user.telegram_id = telegram_id;
                user.username = username;
                user.private_channel_id = private_channel_id;

                return res.status(200).json({ message: "User updated successfully", user });
            } else {
                return res.status(200).json({ message: "No changes detected" });
            }
        } else {
            // Создание нового пользователя, если он не найден
            user = {
                telegram_id,
                username,
                wallet_address,
                private_channel_id
            };

            bd.users.push(user);

            return res.status(201).json({ message: "User created successfully", user });
        }
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
});

app.get('/get_chat_info', async (req, res) => {
    const {chatId} = req.query;
    if (chatId) {
        try {
            const result = await bot.getChat(
                chatId
            )
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json(e.toString())
        }
    }
})

app.post('/buyKey', async (req, res) => {
    const {wallet_address_buyer, wallet_address_owner} = req.body;
    try {
       //TODO: Проверка на то что у человека нет канала
        bd.keys.push({
            wallet_address_buyer,
            wallet_address_owner
        })
       return res.status(200).json('Key bought successfully')
    } catch (e) {
       return res.status(500).json(e.toString())
    }
})

app.post('/sellKey', async (req, res) => {
    const {wallet_address_buyer, wallet_address_owner} = req.body;
    try {
        const index = bd.keys.findIndex(element =>
            element.wallet_address_buyer === wallet_address_buyer &&
            element.wallet_address_owner === wallet_address_owner
        );

        if (index !== -1) {
            bd.keys.splice(index, 1);
        }

        return res.status(200).json('Key sold successfully')
    } catch (e) {
        return res.status(500).json(e.toString())
    }
})

app.get('/get_users', async (req, res) => {
    const {} = req.query;
    try {
        return res.status(200).json(bd.users)
    } catch (e) {
        return res.status(500).json(e.toString())
    }
})

app.get('/get_keys', async (req, res) => {
    const {} = req.query;
    try {
        return res.status(200).json(bd.keys)
    } catch (e) {
        return res.status(500).json(e.toString())
    }
})

app.get('/get_connected_channels', async (req, res) => {
    const { telegram_id } = req.query;  // Используем req.query для GET-запроса
    try {
        const connectedChannels = bd.connected_channels.filter((item) => telegram_id == item.telegram_id);
        const newConnectedChannels = await Promise.all(connectedChannels.map(async (item) => {
            const chatData = await bot.getChat(item.channel_id);
            return { ...item, chatData };
        }));

        console.log( bd.connected_channels)
        return res.status(200).json(newConnectedChannels);
    } catch (e) {
        return res.status(500).json(e.toString());
    }
});


app.get('/get_invite_link', async (req, res) => {
    const {channelId} = req.query;
    if (channelId) {
        try {
            const result = await bot.createChatInviteLink(
                channelId,
                {creates_join_request: true}
            )
            return res.status(200).json(result.invite_link)
        } catch (e) {
            return res.status(500).json(e.toString())
        }
    }
})

app.post('/unbanChatMember', async (req, res) => {
    const {user_id, channelId} = req.body;
    if (user_id) {
        try {
            await bot.unbanChatMember(
                channelId,
                user_id
            )
            return res.status(200).json('User unbanned successfully')
        } catch (e) {
            return res.status(500).json(e.toString())
        }
    }
})

app.post('/banChatMember', async (req, res) => {
    const {user_id, channelId} = req.body;
    if (user_id) {
        try {
            await bot.banChatMember(
                channelId,
                user_id
            )
            return res.status(200).json('User removed successfully')
        } catch (e) {
            return res.status(500).json(e.toString())
        }
    }
})

app.listen(PORT, () => {
  console.log('Server is listening at :', PORT);
});
