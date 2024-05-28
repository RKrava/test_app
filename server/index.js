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

bot.on('new_chat_title', async (msg) => {
    //TODO: Записывать в бд новый тайтл
})

bot.on('new_chat_photo', async (msg) => {
    //TODO: Записывать в бд новую фотку
    //bot.getFileLink()
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
    if (bd.connected_channels.filter((item) => item.channel_id === msg.chat.id).length !== 0) {
        bd.connected_channels = bd.connected_channels.filter((item) => item.channel_id !== msg.from.id)
        return
    }

    const createChatInviteLinkRequest = await bot.createChatInviteLink(
        msg.chat.id,
        {creates_join_request: true}
    )

    bd.connected_channels.push({
        channel_id: msg.chat.id,
        telegram_id: msg.from.id,
        invite_link: createChatInviteLinkRequest.invite_link
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

    const channel = bd.connected_channels.find((item) => item.channel_id === chatId)
    if (!channel) {
        return;
    }

    const joiner = bd.users.find((item) => item.telegram_id == userId)
    const owner = bd.users.find((item) => item.private_channel_id == chatId)
    if (!joiner || !owner) {
        return
    }

    if(bd.keys.some((item) => item.wallet_address_buyer == joiner.wallet_address &&
    item.wallet_address_owner == owner.wallet_address)
    ) {
        await bot.approveChatJoinRequest(chatId, userId)
        return
    }

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
                return res.status(200).json({ message: "No changes detected", user });
            }
        } else {
            // Создание нового пользователя, если он не найден
            user = {
                telegram_id,
                username,
                wallet_address,
                private_channel_id
            };
            const getPhotoRequest = await bot.getUserProfilePhotos(user.telegram_id)
            console.log(getPhotoRequest.photos[0][0])

            bd.users.push(user);

            return res.status(201).json({ message: "User created successfully", user });
        }
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
});

app.post('/buyKey', async (req, res) => {
    const {wallet_address_buyer, wallet_address_owner} = req.body;
    try {
        const owner = bd.users.find((item) => item.wallet_address == wallet_address_owner)
        const buyer = bd.users.find((item) => item.wallet_address == wallet_address_buyer)
        await bot.unbanChatMember(
            owner.private_channel_id,
            buyer.telegram_id
        )

       //TODO: Проверка на то что у человека нет канала
        bd.keys.push({
            wallet_address_buyer,
            wallet_address_owner
        })

        //TODO: анбанить чела который покупает
       return res.status(200).json('Key bought successfully')
    } catch (e) {
       return res.status(500).json(e.toString())
    }
})

app.post('/sellKey', async (req, res) => {
    const {wallet_address_buyer, wallet_address_owner} = req.body;

    try {
        const owner = bd.users.find((item) => item.wallet_address == wallet_address_owner)
        const seller = bd.users.find((item) => item.wallet_address == wallet_address_buyer)

        //TODO: проверка на то остался у чела хотя бы один ключ, тогда не банить
        await bot.banChatMember(
            owner.private_channel_id,
            seller.telegram_id
        )

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
    try {
        const connectedChannels = bd.connected_channels
        const newConnectedChannels = await Promise.all(connectedChannels.map(async (item) => {
            //TODO: Сделать просто записывание в бд и не слать каждый раз запрос
            const chatData = await bot.getChat(item.channel_id);
            item.title = chatData.title
            item.photo = await bot.getFileLink(chatData.photo.big_file_id)
            return item;
        }));
        return res.status(200).json(newConnectedChannels);
    } catch (e) {
        return res.status(500).json(e.toString());
    }
});


app.listen(PORT, () => {
  console.log('Server is listening at :', PORT);
});
