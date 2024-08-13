const { Markup } = require('telegraf');
const { sendOptionsKeyboard } = require('./Keyboard');

let orders = [];

function addOrder(newOrder) {
    orders.push(newOrder); // Додаємо нове замовлення в масив
    console.log('Order added:', newOrder);
    console.log('All orders:', orders);
}

function formatOrder(order) {
    return `${order.title} - ( ${order.quantity} шт. ) Ціна: ${order.price}грн * ${order.quantity} = ${order.price*order.quantity} грн`;
}

function formatUserDetails(user) {
    return `Замовлення від ${user.firstName} ${user.lastName}\n\nКОНТАКТНА ІНФОРМАЦІЯ:\nТелефон: ${user.phone}\nEmail: ${user.email}\nАдреса: ${user.street} ${user.house}, під'їзд: ${user.entrance}, поверх: ${user.floor}, квартира: ${user.apartment}\nКоментар: ${user.comment}\nКількість осіб: ${user.numberOfPersons}\nСпосіб оплати: ${user.paymentMethod}\n\nЗАМОВЛЕННЯ:`;
}

function handleOrders(ctx, allowedUsers) {
    if (orders !== null && Array.isArray(orders) && orders.length > 0) {
        orders.forEach(orderData => {
            let message = formatUserDetails(orderData.user) + "\n\n";
            orderData.orders.forEach((order, index) => {
                message += `${index+1}. ${formatOrder(order)}\n\n`;
            });
            
            let finelprice = 0;
            orderData.orders.forEach(orderData => {
                finelprice+=orderData.price*orderData.quantity
            })

            message +="Загальна ціна: " + finelprice + " грн";
            console.log(`Message: ${message}`);
            try{
                allowedUsers.forEach(chatId => {
                    ctx.telegram.sendMessage(chatId, message);
                });
            }
            catch(e){
                console.log(e);
            }
            
        });

        orders = [];
        sendOptionsKeyboard(ctx);

    } else {
        ctx.reply('Нема нових замовлень');
        console.error('handleOrders ERROR: No orders found or invalid data');
    }
}


module.exports = {
    addOrder,
    handleOrders
};