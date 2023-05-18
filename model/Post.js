const mongoose = require('mongoose');
const User = mongoose.model('Post', {
    title: String,
    data: String,
    description: String 
})
module.exports = Post;