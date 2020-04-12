const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const User = require('./models/user');
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e84cdedb76fec4b3062b637');
    req.user = user;
    //console.log(user);
    next();
  } catch (error) {
    console.log(error);
  }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders',ordersRoutes);

const PORT = process.env.PORT || 3000;

//const url = `mongodb+srv://greenwald80:z03GsdkvLG6TquKf@cluster0-iehwb.mongodb.net/courses`;
async function start() {
  try {
    const url = "mongodb+srv://greenwald80:z03GsdkvLG6TquKf@cluster0-iehwb.mongodb.net/shop";
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false }, () => {
      console.log('Connected to DB');
    })
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        name: 'Alex',
        email: "grin@gmail.com",
        cart: { items: [] }
      })
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (error) {
    console.log(error);
  }
}

start();

