const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const RecipeSchema = mongoose.Schema({
	recipeName: {
		type: String,
		required: true,
	},
	recipeCreator: {
		type: String,
		required: true
	},
	ingredients: {
		type: Number,
		required: true,
	},
	ingredientsList: {
		type: Array
	},
	ingredientABV: {
		type: Array
	},
	parts: {
		type: Array
	},
	totalABV: {
		type: Number,
		required: true
	},
	recipeIngredientsStringArray: {
		type: Array
	},
	userRatings: {
		type: Array
	}
});

RecipeSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		recipeName: this.recipeName,
		recipeCreator: this.recipeCreator,
		totalABV: this.totalABV,
		ingredients: this.recipeIngredientsStringArray,
		userRatings: this.userRatings
	};
};

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = {Recipe};