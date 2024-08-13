const { Markup } = require('telegraf');

function sendOptionsKeyboard(ctx) {
    ctx.reply('Виберіть опцію:', Markup.keyboard([
        ['Замовлення'],
        ['Відгуки', 'Видалити відгук'],
      ])
      .oneTime()
      .resize());
}

module.exports = {
    sendOptionsKeyboard
};
