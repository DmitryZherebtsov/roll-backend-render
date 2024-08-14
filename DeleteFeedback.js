const { Markup } = require('telegraf');
const { sendOptionsKeyboard } = require('./Keyboard');
let message_ids =[]

function handleFeedbackElements(ctx, confirmedReviews) {
    if (confirmedReviews.length === 0){
        ctx.reply("На сайті нема відгуків!")
        sendOptionsKeyboard(ctx);
    }  
    else{
        confirmedReviews.forEach((_, index) => {
            sendReviewElements(ctx, index, confirmedReviews);
        });
        sendOptionsKeyboard(ctx);
    }
    
}

async function sendReviewElements(ctx, index, confirmedReviews) {
    const review = confirmedReviews[index];
    const message = await ctx.reply(`Ім'я: ${review.firstName}\nПрізвище: ${review.lastName}\nТелефон: ${review.phone}\nВідгук: ${review.comment}\nОцінка: ${review.rating}`, 
        Markup.inlineKeyboard([
            Markup.button.callback('Видалити', `deleteReview_${index}`)
        ])
    );
    message_ids.push(message.message_id);
}

function handleDeleteFromReviews(ctx, confirmedReviews){
    const reviewIndex = parseInt(ctx.match[1]);
    ctx.reply('Елемент успішно видалено');
    message_ids.forEach(message_id => {
        ctx.telegram.deleteMessage(ctx.chat.id, message_id)
            .catch(err => console.error(`Не вдалося видалити повідомлення з id ${message_id}:`, err));
    });
    confirmedReviews.splice(reviewIndex, 1);
    console.log(confirmedReviews);
    message_ids = []

    sendOptionsKeyboard(ctx);
}

module.exports = {
    handleFeedbackElements,
    handleDeleteFromReviews
};
