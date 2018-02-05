const express = require('express');
const bodyParser = require('body-parser');

const {Recipe} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//FETCHES RECIPE LIST FROM DB
router.get('/', jsonParser, (req,res) => {
	return Recipe.find()
		.then(recipes => {
			return res.json(recipes.map(recipe => recipe.apiRepr()));
		})
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
			console.log(err);
		});
});

//ADD RECIPE TO DB
router.post('/add', jsonParser, (req,res) => {
	let recipeName = req.body.recipeName;
	let ingredients = req.body.ingredients;
	let ingredientsList = req.body.ingredientsList;
	let ingredientABV = req.body.ingredientABV;
	let parts = req.body.parts;
	let totalABV = req.body.totalABV;
	let ingredientsArray = [];
	let partsString = '';
	for (let i = 0; i < ingredients; i++) {
		if (parts[i] === 1) {
			partsString = 'Part';
		}
		else {
			partsString = 'Parts';
		}
		let ingredientSingle = `${parts[i]} ${partsString} ${ingredientsList[i]} (${ingredientABV[i]}% ABV)`;
		ingredientsArray.push(ingredientSingle);
	}
	return Recipe.create({
		"recipeName": recipeName,
		"ingredients": ingredients,
		"ingredientsList": ingredientsList,
		"ingredientABV": ingredientABV,
		"parts": parts,
		"totalABV": totalABV,
		"recipeIngredientsStringArray": ingredientsArray
	})
	.then(() => {
		return res.status(200).json({message: "Recipe Created!"});
	})
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};