const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const messageSchema = mongoose.Schema({
    text: {type: String, required: true},
    author: {type: String, required: true},
    date: {type: Date, required: true},
    recipient: {type: String}
})

messageSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Message', messageSchema)