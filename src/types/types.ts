export type UserDataType = {
    userName: string,
    walletAddress: string,
    profilePhoto: string,
    privateChannelId: string
};

export type ConnectedChannelType = {
    channel_id: string,
    telegram_id: string,
    title: string,
    photo: {
        small_file_id: string,
        small_file_unique_id: string,
        big_file_id: string,
        big_file_unique_id: string
    }
};

export type KeyType = {
    channelTitle: string,
    number: number,
    inviteLink: string,
    wallet_address_buyer: string,
    wallet_address_owner: string
};

export type UserType = {
    userName: string,
    walletAddress: string,
    telegramId: string,
    privateChannelId: string
};