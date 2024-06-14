const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

/* Nope-List schema Schema */
const nopeListSchema = mongoose.Schema({
    id: String
});
mongoose.model('Nope-List', nopeListSchema);

/* User Schema */
const userSchema = new mongoose.Schema({nopeList: [String]});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;