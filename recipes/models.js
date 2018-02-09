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
	visibility: {
		type: Array
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
		ingredients: this.ingredients,
		ingredientsList: this.ingredientsList,
		ingredientABV: this.ingredientABV,
		parts: this.parts,
		recipeCreator: this.recipeCreator,
		visibility: this.visibility,
		totalABV: this.totalABV,
		ingredientsString: this.recipeIngredientsStringArray,
		userRatings: this.userRatings,
	};
};

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = {Recipe};