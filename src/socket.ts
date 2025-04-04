import { io } from 'socket.io-client'

// export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)
// export const socket = io("http://localhost:8000",{
export const socket = io(import.meta.env.VITE_API_URL, {
  transports: ['websocket']
})

export const requestPrivateCallAccess = (data: {username: string, roomId: string, userId: string}) => {
  socket?.emit('requestPrivateCallAccess', data)
}

export const joinRoom = (roomId: string) => {
  socket?.emit('joinRoom', roomId)
}
