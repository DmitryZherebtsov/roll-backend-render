const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sendOptionsKeyboard } = require('./Keyboard');
const { sendReview, reviewIndexMap } = require('./Feedbacks');
const { handleFeedbackElements, handleDeleteFromReviews } = require('./DeleteFeedback');
const { sendOrder } = require('./Orders');

const bot = new Telegraf('7229021767:AAF-0lwuhfCXzlC_uDOrgxX1a0LCwCTjgYo');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const allowedUsers = [786187640, 1027031193];
const allowedUsersForReviews = [786187640, 1027031193];

let confirmedReviews = [
  { firstName: 'Іван', lastName: 'Іванов', comment: 'Дуже сподобалося!', phone: '123-456-7890', rating: 5 },
  { firstName: 'Марія', lastName: 'Петренко', comment: 'Все було добре.', phone: '098-765-4321', rating: 4 },
  { firstName: 'Олександр', lastName: 'Сидоренко', comment: 'Може бути краще.', phone: '234-567-8901', rating: 3 }
];

//---------------------------checkUserPermission---------------------------//
const checkUserPermission = (ctx, next) => {
  const userId = ctx.from.id;
  if (allowedUsers.includes(userId)) {
      return next();
  } else {
      ctx.reply('У вас немає доступу до цього бота.');
      console.log(`${userId} не пройшов перевірку!`);
  }
};

const checkUserPermissionForReviews = (ctx, next) => {
  const userId = ctx.from.id;
  if (allowedUsersForReviews.includes(userId)) {
      return true;
  } else {
      ctx.reply('У вас немає доступу відгуків.');
      console.log(`${userId} не пройшов перевірку!`);
      return false;
  }
};

//---------------------------Get Orders---------------------------//
app.post('/api/data', async (req, res) => {
  const newOrder = req.body;
  try {
    sendOrder(newOrder, allowedUsers, bot);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//---------------------------Get Reviews---------------------------//
app.post('/api/reviews', (req, res) => {
  const newReviews = req.body;
  if (typeof newReviews !== 'object' || newReviews === null) {
      return res.status(400).send("Неправильний формат даних. Очікувався об'єкт.");
  }
  try {
    sendReview(newReviews, allowedUsersForReviews, bot);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//---------------------------Send Reviews---------------------------//
app.get('/api/getReviews', (req, res) => {
  res.json(confirmedReviews);
  console.log("Підтверджені відгуки надіслано на сайт!");
});

app.get('/', (req, res) => {
  res.send('Express is working correctly 0.0');
});


bot.use(checkUserPermission);

bot.start((ctx) => {
  console.log(`Отримано повідомлення від chat ID: ${ctx.chat.id}`);
  sendOptionsKeyboard(ctx);
});


bot.hears('Видалити відгук', (ctx) => {
  if(checkUserPermissionForReviews(ctx))
    handleFeedbackElements(ctx, confirmedReviews);
});

bot.action(/add_(\d+)/, (ctx) => {
  const index = parseInt(ctx.match[1]);
  const review = reviewIndexMap.get(index);

  if (review) {
      confirmedReviews.push(review);
      ctx.reply('Відгук додано!');
      ctx.deleteMessage();
      reviewIndexMap.delete(index);
  } else {
      ctx.reply('Відгук не знайдено.');
  }
});

bot.action(/reject_(\d+)/, (ctx) => {
  const index = parseInt(ctx.match[1]);
  const review = reviewIndexMap.get(index);

  if (review) {
      ctx.reply('Відгук видалено!');
      ctx.deleteMessage();
      reviewIndexMap.delete(index);
  } else {
      ctx.reply('Відгук не знайдено.');
  }
});

bot.action(/deleteReview_(.+)/, (ctx) => {
  handleDeleteFromReviews(ctx, confirmedReviews);
});

bot.catch((err, ctx) => {
  console.error(`Помилка!!!!!!! ${ctx.updateType}`, err);
});

app.listen(port, () => {
  console.log(`Сервер працює: http://localhost:${port}`);
});

bot.launch();


