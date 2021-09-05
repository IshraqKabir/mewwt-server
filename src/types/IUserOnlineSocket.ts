export interface IUserOnlineSocket {
    userId: number;
    socketId: string;
    loggedInAt: Date;
    loggedOutAt?: string;
}
