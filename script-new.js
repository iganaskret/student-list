"use strict";

window.addEventListener("DOMContentLoaded", start);

const people = [];
let myLink = "http://petlatkea.dk/2019/students1991.json";

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons

  loadJSON();
}

function loadJSON() {
  fetch(myLink)
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      splitJSON(jsonData);
    });
}

function splitJSON(jsonData) {
  jsonData.forEach(jsonObject => {
    // DONE: Create new object with cleaned data
    const person = Object.create(Person);
    // DONE: Interpret jsonObject into Animal properties
    console.log(jsonObject);

    const text = jsonObject.fullname.split(" ");
    person.name = text[0];
    person.lastName = text[1];
    // animal.name = jsonObject.fullname.split(" ")[0];
    // animal.type = jsonObject.fullname.split(" ")[3];
    // animal.desc = jsonObject.fullname.split(" ")[2];
    person.house = jsonObject.house;
    console.log(person);

    people.push(person);
  });

  filterList(people);
}

function filterList(list) {
  // TODO: Add filtering, according to setting
  const filteredList = list; // right now, just don't filter anything
  sortList(filteredList);
}

function sortList(list) {
  // TODO: Sort the list that is received, before displaying it
  displayList(list);
}

function displayList(people) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  people.forEach(displayPerson);
}

function displayPerson(person) {
  // create clone
  const clone = document
    .querySelector("template#person")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = person.name;
  clone.querySelector("[data-field=last-name]").textContent = person.lastName;
  clone.querySelector("[data-field=house]").textContent = person.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//prototype Animal
const Person = {
  name: "-name-",
  lastName: "-last-name-",
  house: "-house-"
};
