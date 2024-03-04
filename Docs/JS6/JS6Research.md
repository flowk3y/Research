
# JS6 - ECMAScript 2015
This version has added important new syntax. It brings significant enhancements and new features to JavaScript, making the language more expressive, powerful, and easier to work with.

## Support browsers
|Browser|Version|Date|
|--|--|--|
|Chrome|51|May 2016|
|Firefox|52|Mar 2017|
|Edge|14|Aug 2016|
|Safari|10|Sep 2016|
|Opera|38|Jun 2016|

## Examples

### Let and const (_Block Scope_)
#### Let
```javascript
// ES5
var a = "JS";
```
```javascript
{
  // a can use in this { }
  let a = "JS";
}

// a can NOT be used here
console.log(a);
// error: a is not defined
```

#### Const
```javascript
const lovePL = "C/C++";
// Here lovePL is C/C++

{
const lovePL = "Javascript";
// Here lovePL is Javascript
}

// Here lovePL is C/C++
```

### Arrow function
Provide a concise syntax for writing function expressions. They are especially useful for writing shorter and cleaner code. For example:
```javascript
// ES5 function expression
var multiply = function(a, b) {
    return a * b;
};

// ES6 arrow function
const multiply = (a, b) => a * b;
```

### Template Literals:
Template literals allow for easier string interpolation and multiline strings. They are enclosed by backticks (`) instead of single or double quotes.
```javascript
const name = 'Johnny';
console.log(`Hello, ${name}!`);
```

### Destructuring Assignment
Destructuring assignment allows you to extract values from arrays or properties from objects into distinct variables easily.
```javascript
// instead of
const person = { name: 'John', age: 30 };
const name = person.name;
const age = person.age;

// shorten
const person = { name: 'John', age: 30 };
const { name, age } = person;
```

### Classes
ES6 introduced a more convenient syntax for defining classes in JavaScript, which is closer to traditional object-oriented programming languages.

```javascript

// ES5
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  console.log("Hello, " + this.name + "!");
};

// ES6
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        return `Hello, my name is ${this.name} and I'm ${this.age} years old.`;
    }
}
```

### Modules
Now we can import/export variable or function amongs files.
```javascript
// Exporting module
export const PI = 3.14;
export function double(num) {
    return num * 2;
}

// Importing module
import { PI, double } from './math';
```

### Default Parameters
Easier set default parameter than ES5
```javascript
// ES5
function crawlWeb(url) {
  return url || "www.google.com"
}

// ES6
function crawWeb(url = "www.google.com") {
  return url
}
```

### Function Rest Parameter
```javascript
function sum(...data) {
  let sum = 0;
  for (let data of datas) sum += data;
  return sum;
}

let x = sum(4, 9, 16, 25, 29, 100, 66, 77);
```

### Promise
In JavaScript, a Promise is an object representing the eventual completion or failure of an asynchronous operation, and its resulting value. It allows you to handle asynchronous operations more easily, avoiding callback hell and writing cleaner asynchronous code.

#### States:

A Promise can be in one of three states:

**Pending**: Initial state, neither fulfilled nor rejected.

**Fulfilled**: The operation completed successfully.

**Rejected**: The operation failed.

**Settled**: Reject and Fulfilled is called settled when the operation completed.

#### Chaining:

Promises can be chained using .then() to handle the eventual result or the error of the asynchronous operation.

#### Error Handling:

Errors in Promises can be caught using .catch() to handle any rejected promises in the chain.

```javascript

function showStatus(data) {
  if (data.userId)
    console.log("Hey user, I got data of userID: " + data.userId);
  return data
}

function fetchData() {
  return new Promise((resolve, reject) => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject('Error fetching data');
        }
      })
      .catch(error => reject(error));
  });
}

fetchData()
  .then(data => showStatus(data))
  .then(data => console.log(data))
  .catch(error => console.error(error));
```