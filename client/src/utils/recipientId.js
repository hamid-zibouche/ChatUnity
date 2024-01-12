
export const getRecipientId = (user,currentChat)=>{
    const idUser1 = currentChat?.idUser1
    const idUser2 = currentChat?.idUser2
    let recipientId = null


    if (user?.id == idUser1) {
      recipientId = idUser2
    } else if (user?.id == idUser2) {
      recipientId = idUser1
    }

    return recipientId;
}