const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true, select: false },
	profileImage: String,
	cep: Number,
  endereco: String
}, { collection: 'Users'});

module.exports = mongoose.model('User', userSchema);
