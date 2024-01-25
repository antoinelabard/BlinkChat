const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const channelSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    author: {type: String, required: true},
    users: [{type: String}],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
})

channelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Channel', channelSchema)