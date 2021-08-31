export interface IUserDisconnectedSocket {
    userId: number;
    socketId: string;
    loggedInAt: Date;
    loggedOutAt: Date;
}
