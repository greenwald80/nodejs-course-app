const { Router } = require('express');
//const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();

// function mapCartItems(cart) {
//     return cart.items.map(c => ({//получаем таким образом объект
//         //c.courseId._doc //old sintax
//         ...c.courseId._id,//using ES6
//         count: c.count
//     }));
// }
function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc, 
        count: c.count,
        id:c.courseId.id
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0);
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    //await Card.add(course);
    await req.user.addToCart(course);
    res.redirect('/card');
})

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    //console.log(user);
    const courses = mapCartItems(user.cart);
    res.render('card', {
        title: 'Card',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    });
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = mapCartItems(user.cart);
    const cart = {
        courses, price: computePrice(courses)
    }
    res.status(200).json(cart);
})

module.exports = router;