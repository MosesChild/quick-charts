import {
    simpleTable
} from '../simpleTable.js';
// an example of how to use simpleTable.

var exampleObject = {
    name: 'anyOldObject',
    date: new Date().toDateString(),
    anArray : [1, 2, 3, 4],
    aNestedObject: {
        name: 'nestedObject1',
        prop1: "funny",
        value: 15
    }
};

var nested=document.querySelector('nestedObject1');
console.log(   `nested ${nested}`)
simpleTable(exampleObject);