const express = require('express');
const bodyParser = require('body-parser');

const {Recipe} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//FETCHES FULL RECIPE LIST FROM DB
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
	let recipeCreator = req.body.recipeCreator;
	let ingredients = req.body.ingredients;
	let visibility = req.body.visibility;
	let ingredientsList = req.body.ingredientsList;
	let ingredientABV = req.body.ingredientABV;
	let parts = req.body.parts;
	let totalABV = req.body.totalABV;
	let ingredientsArray = [];
	let partsString = '';
	for (let i = 0; i < ingredients; i++) {
		if (parts[i] === 1) {
			partsString = 'part';
		}
		else {
			partsString = 'parts';
		}
		let ingredientSingle = `${parts[i]} ${partsString}: ${ingredientsList[i]} (${ingredientABV[i]}% ABV)`;
		ingredientsArray.push(ingredientSingle);
	}
	return Recipe.create({
		"recipeName": recipeName,
		"recipeCreator": recipeCreator,
		"ingredients": ingredients,
		"visibility": visibility,
		"ingredientsList": ingredientsList,
		"ingredientABV": ingredientABV,
		"parts": parts,
		"totalABV": totalABV,
		"recipeIngredientsStringArray": ingredientsArray,
		"userRatings": []
	})
	.then(() => {
		return res.status(200).json({message: "Recipe Created!"});
	})
	.catch((err) => {
		console.log(err);
		res.status(500).json({message: 'Internal server error'});
	});
});

//RATE RECIPES
router.post('/rate', jsonParser, (req,res) => {
	let recipeID = req.body.id;
	let rating = req.body.rating;
	let username = req.body.username;
	return Recipe.update(
		{_id: recipeID},
		{
			$pull: {
				userRatings: {
					username: username
				}
			}
		}
	)
	.then(() => {
	if (rating === null) {
		return;
	}
	return Recipe.update(
		{_id: recipeID},
		{
			$push: {
				userRatings: {
					username: username,
					rating: rating
				}
			}
		}
	)
	})
	.then(() => {
		return res.status(200).json({message: 'recipe rated'});
	})
	.catch(err => {
		console.log(err);
		return res.status(500).json({message: 'Internal server error'})
	});
});

//DELETE RECIPES FROM DB
router.post('/delete', jsonParser, (req,res) => {
	let recipeID = req.body.id;
	let username = req.body.username;
	return Recipe.remove(
		{
			_id: recipeID, recipeCreator: username
		})
		.then(() => {
			return res.status(200).json({message: 'recipe deleted'})
		})
		.catch(err => alert('this isn\'t your recipe!'));
});

//EDIT RECIPE ON DB
router.post('/edit', jsonParser, (req,res) => {
	let recipeID = req.body.id;
	let recipeName = req.body.recipeName;
	let recipeCreator = req.body.recipeCreator;
	let ingredients = req.body.ingredients;
	let visibility = req.body.visibility;
	let ingredientsList = req.body.ingredientsList;
	let ingredientABV = req.body.ingredientABV;
	let parts = req.body.parts;
	let totalABV = req.body.totalABV;
	let ingredientsArray = [];
	let partsString = '';
	for (let i = 0; i < ingredients; i++) {
		if (parts[i] === 1) {
			partsString = 'part';
		}
		else {
			partsString = 'parts';
		}
		let ingredientSingle = `${parts[i]} ${partsString}: ${ingredientsList[i]} (${ingredientABV[i]}% ABV)`;
		ingredientsArray.push(ingredientSingle);
	}
	return Recipe.update(
		{_id: recipeID},
		{
			"recipeName": recipeName,
			"recipeCreator": recipeCreator,
			"ingredients": ingredients,
			"visibility": visibility,
			"ingredientsList": ingredientsList,
			"ingredientABV": ingredientABV,
			"parts": parts,
			"totalABV": totalABV,
			"recipeIngredientsStringArray": ingredientsArray
		}
	)
	.then(() => {
		return res.status(200).json({message: "Recipe Edited!"});
	})
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};