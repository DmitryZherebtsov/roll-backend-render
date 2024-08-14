const { Markup } = require('telegraf');

let reviewIndexMap = new Map();

function generateUniqueIndex() {
    let index;
    do {
        index = Math.floor(Math.random() * 1000000);
    } while (reviewIndexMap.has(index));
    return index;
  }
  function sendReview(mes, allowedUsers, bot) {
    let review = mes;
    let index = generateUniqueIndex();
    reviewIndexMap.set(index, review);
  
    let messageText = `Ім'я: ${review.firstName}\nПрізвище: ${review.lastName}\nТелефон: ${review.phone}\nВідгук: ${review.comment}\nОцінка: ${review.rating}`;
  
    let keyboard = Markup.inlineKeyboard([
      Markup.button.callback('Додати', `add_${index}`),
      Markup.button.callback('Видалити', `reject_${index}`)
    ]);
  
    try {
      allowedUsers.forEach(chatId => {
        bot.telegram.sendMessage(chatId, messageText, keyboard)
          .then(response => {
            console.log(`Повідомлення відправлено до chatId: ${chatId}`, response);
          })
          .catch(error => {
            console.error(`Помилка з відправкою повідомлення до chatId: ${chatId}`, error);
          });
      });
    } catch (e) {
      console.log(e);
    }
  }

module.exports = {
    sendReview,
    reviewIndexMap
};
