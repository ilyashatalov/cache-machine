const mongoose = require('mongoose');

var entrySchema = mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique : true
    },
    value: { 
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: () => { return new Date() }
    }
});

module.exports = mongoose.model("Entry", entrySchema); 