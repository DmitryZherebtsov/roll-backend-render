
function formatOrder(order) {
    return `${order.title} - ( ${order.quantity} шт. ) Ціна: ${order.price}грн * ${order.quantity} = ${order.price*order.quantity} грн`;
}
  
function formatUserDetails(user) {
    return `Замовлення від ${user.firstName} ${user.lastName}\n\nКОНТАКТНА ІНФОРМАЦІЯ:\nТелефон: ${user.phone}\nEmail: ${user.email}\nАдреса: ${user.street} ${user.house}, під'їзд: ${user.entrance}, поверх: ${user.floor}, квартира: ${user.apartment}\nКоментар: ${user.comment}\nКількість осіб: ${user.numberOfPersons}\nСпосіб оплати: ${user.paymentMethod}\n\nЗАМОВЛЕННЯ:`;
}
  
function sendOrder(mes, allowedUsers, bot) {
    let orders = [];
    orders.push(mes)
  
    orders.forEach(orderData => {
        let message = formatUserDetails(orderData.user) + "\n\n";
        orderData.orders.forEach((order, index) => {
            message += `${index+1}. ${formatOrder(order)}\n\n`;
        });
      
        let finalprice = 0;
        orderData.orders.forEach(orderData => {
            finalprice+=orderData.price*orderData.quantity
        })
  
        message +="Загальна ціна: " + finalprice + " грн";
        console.log(`Message: ${message}`);
        try{
            allowedUsers.forEach(chatId => {
            bot.telegram.sendMessage(chatId, message)
                .then(response => {
                    console.log(`Повідомлення відправлено до chatId: ${chatId}`, response);
                })
                .catch(error => {
                    console.error(`Помилка з відправкою повідомлення до chatId: ${chatId}`, error);
                });
        })
            orders = [];
        }
        catch(e){
            console.log(e);
        }
      
    })
};
module.exports = {
    sendOrder
}
