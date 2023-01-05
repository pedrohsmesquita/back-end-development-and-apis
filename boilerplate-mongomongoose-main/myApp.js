require('dotenv').config();
// 1)
const database = require('./src/database.js');
// 2)
const Person = require('./src/model/personSchema.js');

// 3)
const createAndSavePerson = (done) => {
    const person = new Person({
        name: "person 1",
        age: 24,
        favoriteFoods: ['burguer', 'pizza']
    });

    person.save((err, data) => {
        if (err) return console.error(err);
        done(null, data);
    })
};

// 4)
const createManyPeople = (arrayOfPeople, done) => {
      Person.create(arrayOfPeople, (err, data) => {
          if (err) return console.error(err);
          done(null, data);
      })
};

// 5)
const findPeopleByName = (personName, done) => {
    Person.find({name: personName}, (err, data) => {
        if (err) return console.error(err);
        done(null, data);
    })
};

// 6)
const findOneByFood = (food, done) => {
    Person.findOne({favoriteFoods: food}, (err, data) => {
        if (err) return console.error(err);
        done(null, data);
    })
};

// 7)
const findPersonById = (personId, done) => {
    Person.findById({_id: personId}, (err, data) => {
        if (err) return console.error(err);
        done(null, data);
    })
};

// 8)
const findEditThenSave = (personId, done) => {
    const foodToAdd = "hamburger";

    Person.findById({_id: personId}, (err, data) => {
        if (err) return console.error(err);
        data.favoriteFoods.push(foodToAdd);
        data.save((err, updatedData) => {
            if (err) return console.error(err);
            done(null, updatedData);
        })
    })
};

// 9)
const findAndUpdate = (personName, done) => {
    const ageToSet = 20;

    Person.findOneAndUpdate(
        { name: personName },
        { age: ageToSet },
        { new: true },
        (err, updatedData) => {
            if (err) return console.error(err);
            done(null, updatedData);
        });
};

// 10)
const removeById = (personId, done) => {
    Person.findOneAndRemove({_id: personId}, (err, removedData) => {
        if (err) return console.error(err);
        done(null, removedData);
    })
};

// 11)
const removeManyPeople = (done) => {
    const nameToRemove = "Mary";

    Person.remove({name: nameToRemove}, (err, removedData) => {
        if (err) return console.error(err);
        done(null, removedData);
    })
};

// 12)
const queryChain = (done) => {
    const foodToSearch = "burrito";

    Person.find({favoriteFoods: foodToSearch})
          .sort({name: 1})
          .limit(2)
          .select({age: 0})
          .exec((err, data) => {
            if (err) return console.error(err);
            done(null, data);
          })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
