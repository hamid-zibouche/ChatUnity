
export const unReadNotification = (notification)=>{
    return notification.filter((n) => n.read == false )
}