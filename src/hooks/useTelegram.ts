export function useTelegram() {
    const tg = window.Telegram.WebApp

    const onClose = () => {
        tg.close()
    }

    const onToggleButton = () => {
        if(tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }
    return {
        onClose,
        onToggleButton,
        tg,
        tgUser: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id
    }
}