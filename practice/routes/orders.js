const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get('/', async (req, res) => {
    try {
        //get all orders of user by userId
        const orders = await Order.find({
            'user.userId': req.user._id//если совпадает айди юзера, то тогда это все наши заказы
        }).populate('user.userId');
        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,//разворачивает каждый заказ
                    price: o.courses.reduce((total, c) => {//посчитать цену
                        return total += c.count * c.course.price;
                    }, 0)
                }
            })
        });
    } catch (error) {
        console.log(error);

    }

})

router.post('/', async (req, res) => {
    try {
        //айди курсов превращают в объекты
        const user = await req.user.populate('cart.items.courseId').execPopulate();

        // const courses = user.cart.items.map(i => {
        //     return {
        //         count: i.count, course: i.courseId._doc
        //     }
        // });
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: { ...i.courseId._doc }//spread operator чтобы развернуть объект
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        });
        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;