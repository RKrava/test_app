import axios from 'axios'

export const UserApi = {
    updateUser: async (telegram_id: string, username: string, wallet_address: string, private_channel_id: string) => {
        return await axios.post('http://localhost:8000/update_user', {
            telegram_id, username, wallet_address, private_channel_id
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    buyKey: async (wallet_address_buyer: string, wallet_address_owner: string) => {
        return await axios.post('http://localhost:8000/buyKey', {
             wallet_address_buyer, wallet_address_owner
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    sellKey: async (wallet_address_buyer: string, wallet_address_owner: string) => {
        return await axios.post('http://localhost:8000/sellKey', {
            wallet_address_buyer, wallet_address_owner
        })
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    getUsers: async () => {
        return await axios.get('http://localhost:8000/get_users')
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    getKeys: async () => {
        return await axios.get('http://localhost:8000/get_keys')
            .then(response => response.data)
            .catch(error => error.response.data)
    },
    getConnectedChannels: async () => {
        return await axios.get('http://localhost:8000/get_connected_channels')
            .then(response => response.data)
            .catch(error => error.response.data)
    },
}