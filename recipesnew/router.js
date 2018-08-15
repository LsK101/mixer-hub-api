const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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

const jwtAuth = passport.authenticate('jwt', {session: false});

//ADD RECIPE TO DB
router.post('/add', jwtAuth, jsonParser, (req,res) => {
	let recipeName = req.body.recipeName;
	let username = req.body.username;
	let ingredients = req.body.ingredients;
	let totalABV = req.body.totalABV;
	return RecipeNew.create({
		"recipeName": recipeName,
		"username": username,
		"ingredients": ingredients,
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
router.post('/rate', jwtAuth, jsonParser, (req,res) => {
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
router.post('/delete', jwtAuth, jsonParser, (req,res) => {
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
router.post('/edit', jwtAuth, jsonParser, (req,res) => {
	let recipeID = req.body.id;
	let recipeName = req.body.recipeName;
	let username = req.body.username;
	let ingredients = req.body.ingredients;
	let totalABV = req.body.totalABV;
	return RecipeNew.update(
		{_id: recipeID},
		{
			"recipeName": recipeName,
			"username": username,
			"ingredients": ingredients,
			"totalABV": totalABV,
		}
	)
	.then(() => {
		return res.status(200).json({message: "Recipe Edited!"});
	})
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};