const express = require('express');
const bodyParser = require('body-parser');

const {RecipeNew} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//FETCHES FULL RECIPE LIST FROM DB
router.get('/', jsonParser, (req,res) => {
	return RecipeNew.find()
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
	let username = req.body.username;
	let ingredientsCount = req.body.ingredientsCount;
	let ingredientsArray = req.body.ingredientsArray;
	let ingredientABV = req.body.ingredientABV;
	let partsArray = req.body.partsArray;
	let totalABV = req.body.totalABV;
	return RecipeNew.create({
		"recipeName": recipeName,
		"username": username,
		"ingredients": ingredients,
		"ingredientsArray": ingredientsArray,
		"ingredientABV": ingredientABV,
		"partsArray": partsArray,
		"totalABV": totalABV,
		"ratings": []
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
	return RecipeNew.update(
		{_id: recipeID},
		{
			$pull: {
				ratings: {
					username: username
				}
			}
		}
	)
	.then(() => {
	if (rating === null) {
		return;
	}
	return RecipeNew.update(
		{_id: recipeID},
		{
			$push: {
				ratings: {
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
	return RecipeNew.remove(
		{
			_id: recipeID, username: username
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
	let username = req.body.username;
	let ingredients = req.body.ingredients;
	let ingredientsArray = req.body.ingredientsArray;
	let ingredientABV = req.body.ingredientABV;
	let parts = req.body.parts;
	let totalABV = req.body.totalABV;
	return RecipeNew.update(
		{_id: recipeID},
		{
			"recipeName": recipeName,
			"username": username,
			"ingredients": ingredients,
			"ingredientsArray": ingredientsArray,
			"ingredientABV": ingredientABV,
			"parts": parts,
			"totalABV": totalABV,
		}
	)
	.then(() => {
		return res.status(200).json({message: "Recipe Edited!"});
	})
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};