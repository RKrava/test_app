import axios from 'axios'

export const BotApi = {
    getChatInfo: async (chatId: string) => {
        return await axios.get('http://localhost:8000/get_chat_info',{
            params: {
                chatId
            }
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    getInviteLink: async (channelId: string) => {
        return await axios.get('http://localhost:8000/get_invite_link',{
            params: {
                channelId
            }
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    banChatMember: async (user_id: string, channelId: string) => {
        return await axios.get('http://localhost:8000/banChatMember',{
            params: {
                user_id, channelId
            }
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    unbanChatMember: async (user_id: string, channelId: string) => {
        return await axios.get('http://localhost:8000/unbanChatMember',{
            params: {
                user_id, channelId
            }
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
}