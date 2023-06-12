export interface ResponseMessage {
    message?: string,
    code?: number,
    cacheFile?:string,
    notificationType?: number,
    body?:string
    error?: string,
    statusCode?: number
}