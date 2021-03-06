const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const RecipeNewSchema = mongoose.Schema({
	recipeName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	ingredients: {
		type: Array,
		required: true
	},
	totalABV: {
		type: Number,
		required: true
	},
	simpleMode: {
		type: Boolean,
		required: true
	},
	ratings: {
		type: Array
	}
});

RecipeNewSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		recipeName: this.recipeName,
		username: this.username,
		ingredients: this.ingredients,
		totalABV: this.totalABV,
		ratings: this.ratings,
		simpleMode: this.simpleMode
	};
};

const RecipeNew = mongoose.model('RecipeNew', RecipeNewSchema);

module.exports = {RecipeNew};