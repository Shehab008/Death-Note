const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({

    victimName: String,

    reason: String,

    details: String,

    writtenAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        default: 'WAITING'
    }

});

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true
    },

    password: String,

    role: {
        type: String,
        default: 'user'
    },

    lifeDays: Number,

    eyesActive: {
        type: Boolean,
        default: false
    },

    hasNotebook: {
        type: Boolean,
        default: true
    },

    dead: {
        type: Boolean,
        default: false
    },

    notes: [NoteSchema]

});

module.exports = mongoose.model('User', UserSchema);
