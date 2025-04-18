import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    items: [{
        product: {type: String, required: true, ref: 'product'},
        quantity: {type: Number, required: true}
    }],
    quantity: {type: Number, required: true},
    address: {type: String, required: true},
    status: {type: String, default: 'Order Placed'},
    paymentType: {type: String, required: true},
    isPaid: {type: Boolean, required: true, default: false}
},{ timestamps: true})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order;