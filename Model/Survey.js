const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveySchema = new Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },

    age: {
        type: String,
        default: 'Not Specified'
    },
    sex:{
        type: String,
        default: 'Not Specified'
    },
    platform:{
        type: String,
        default: 'Not Specified'
    },
    frequency:{
        type: String,
        default: 'Not Specified'
    }
});

module.exports = mongoose.model('Survey', surveySchema);
