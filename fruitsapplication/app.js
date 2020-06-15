
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const fruitSchema = new mongoose.Schema ({
    name: String,
    rating: {
      type: Number, 
      min:1 ,
      max:10
    },
    review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit ({
    name: "Apple",
        rating: 15,
        review: "Red fruit"
});

// fruit.save();

const personSchema = new mongoose.Schema ({
  name: String,
  age: Number
});
const Person = mongoose.model("Person", personSchema);

const person = new Person ({
    name: "John",
    age: 25
});
person.save();




  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('fruits');
    // Find some documents
    collection.find({}).toArray(function(err, fruits) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(fruits)
      callback(fruits);
    });
  };

  // Fruit.deleteMany({name:"Apple"}, function(err){
  //   if (err){
  //     console.log(err);
  //   }else{
  //     console.log("Succesfully deleted the document");
      
  //   }
  // }) ;