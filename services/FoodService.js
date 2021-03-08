const Food = require('../models/food');

class FoodService {
    constructor() {
    }
    
    async getFood() {
        const food = arguments[0] != null ? await Food.findOne(arguments[0]): await Food.find()
        return food
    }
    
    createFood(name, fats, carbs, protein, fiber) {
        const food = new Food({
            name: name,
            fats: fats,
            carbs: carbs,
            protein: protein,
            fiber: fiber
        })
        return food.save()
    }

    async updateFood(id, data) {
        const food = await Food.findByIdAndUpdate(id, data, {new: true})
        return food
    }

    async deleteFood(id) {
        await Food.findByIdAndRemove(id)
    }

    emptyFood() {
        const food = new Food()
        return food
    }

    getNutrientsCalories(food, grams=100) {
        const nutrientsGrams = this.getNutrientsGrams(food, grams)
        var fatsCalories = nutrientsGrams[0] * 9;
        fatsCalories = Math.round(fatsCalories * 100) / 100;
        var carbsCalories = nutrientsGrams[1] * 4;
        carbsCalories = Math.round(carbsCalories * 100) / 100;
        var proteinCalories = nutrientsGrams[2] * 4;
        proteinCalories = Math.round(proteinCalories * 100) / 100;
        var fiberCalories = nutrientsGrams[3] * 2;
        fiberCalories = Math.round(fiberCalories * 100) / 100;
        var data = [fatsCalories, carbsCalories, proteinCalories, fiberCalories];
        return data;
    }

    getNutrientsGrams(food, grams=100) {
        var fatsGrams = food.fats / 100 * grams;
        fatsGrams = Math.round(fatsGrams * 100) / 100;
        var fatsCarbs = food.carbs / 100 * grams;
        fatsCarbs = Math.round(fatsCarbs * 100) / 100;
        var fatsProtein = food.protein / 100 * grams;
        fatsProtein = Math.round(fatsProtein * 100) / 100;
        var fatsFiber = food.fiber / 100 * grams;
        fatsFiber = Math.round(fatsFiber * 100) / 100;
        var data = [fatsGrams, fatsCarbs, fatsProtein, fatsFiber];
        return data;
    }
}

module.exports = FoodService

/// TO CLEAN

/*
async function renderNewPage(res, food, hasError = false) {
    renderFormPage(res, food, 'new', hasError)
}

async function renderFormPage(res, food, form, hasError = false) {
    try {
        const params = {
        food: food
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Food'
            } else {
                params.errorMessage = 'Error Creating Food'
            }
        } 
        res.render(`foods/${form}`, params)
    } catch {
        res.redirect('/')
    }
}
*/

