const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function (course) {//важно использовать function() вместо arrow function ()=>, чтобы было this
    ////const clonedItems = this.cart.items.concat();//создать копию массива корзины
    // const clonedItems = [...this.cart.items];//the same array copy using ES6 sintax
    // const idx = clonedItems.findIndex(c => {
    //     c.courseId.toString() === course._id.toString();
    // })
    // if (idx >= 0) {
    //     clonedItems[idx].count = clonedItems[idx].count + 1;
    // } else {
    //     clonedItems.push({
    //         courseId: course._id,
    //         count: 1
    //     })
    // }    
    //// const newCart = {items:clonedItems};
    //// this.cart = newCart;
    // this.cart = {items:clonedItems};

    const items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    });
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            courseId: course._id,
            count: 1
        });
    }
    // const newCart = {items: items}
    // this.cart = newCart  
    this.cart = { items };
    return this.save();
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === id.toString();
    });
    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString());
    } else {
        items[idx].count--;
    }
    this.cart = { items };
    return this.save();
}

userSchema.methods.clearCart=function(){
    this.cart = {items:[]};//пустой объект
    return this.save();
}

module.exports = model('User', userSchema);
