import { io } from 'socket.io-client'

export const initSocket = () => {
    const options = {
        'force new connection': true,
        reconnectioAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket']
    }

    return io(process.env.REACT_APP_BACKEND_URL, options)
}