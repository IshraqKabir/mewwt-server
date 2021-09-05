export interface IUserOnlineStatus {
    userId: number;
    isOnline: boolean;
    socketIds: string[];
    lastSeen?: string;
}
