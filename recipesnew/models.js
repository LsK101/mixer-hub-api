const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const RecipeNewSchema = mongoose.Schema({
	recipeName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true
	},
	ingredientsCount: {
		type: Number,
		required: true,
	},
	ingredientsArray: {
		type: Array
	},
	ingredientABV: {
		type: Array
	},
	partsArray: {
		type: Array
	},
	totalABV: {
		type: Number,
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
		ingredientsCount: this.ingredientsCount,
		ingredientsArray: this.ingredientsArray,
		ingredientABV: this.ingredientABV,
		partsArray: this.parts,
		totalABV: this.totalABV
	};
};

const RecipeNew = mongoose.model('RecipeNew', RecipeNewSchema);

module.exports = {RecipeNew};