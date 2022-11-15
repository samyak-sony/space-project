const mongoose = require('mongoose');
const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    }
});
//connects launchesSchema with theh "launches" collection as mongoDB collections should always be plural nouns
module.exports = mongoose.model('Planet',planetSchema);