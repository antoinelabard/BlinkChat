const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const channelSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    author: {type: String, required: true},
    messages: { type: [String], required: true },
})

channelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Channel', channelSchema)