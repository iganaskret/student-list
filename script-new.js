"use strict";

window.addEventListener("DOMContentLoaded", start);

const people = [];
let myLink = "http://petlatkea.dk/2019/students1991.json";
const houseFilter = document.querySelector("#house-filter");
const nameBtn = document.querySelector("#name-btn");
const lastNameBtn = document.querySelector("#last-name-btn");
const houseBtn = document.querySelector("#house-btn");
let sortBy = "house";

function start() {
  // Event-listeners to filter and sort buttons
  houseFilter.addEventListener("change", filterList);
  nameBtn.addEventListener("click", changeSortBy);
  lastNameBtn.addEventListener("click", changeSortBy);
  houseBtn.addEventListener("click", changeSortBy);
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
    // Create new object with cleaned data
    const person = Object.create(Person);
    // Interpret jsonObject into Animal properties
    const text = jsonObject.fullname.split(" ");
    person.name = text[0];
    person.lastName = text[1];
    person.house = jsonObject.house;

    people.push(person);
  });

  filterList();
}

function filterList() {
  // list of students
  console.log(people);
  let filteredList = [];

  // check which filtering option is checked
  const value = houseFilter[houseFilter.selectedIndex].value;

  // if all then pass to sorting, else filter by that house
  if (value === "all") {
    filteredList = people;
  } else {
    filteredList = people.filter(filterByHouse);
  }

  function filterByHouse(person) {
    if (person.house === value) {
      return true;
    } else {
      return false;
    }
  }

  sortList(filteredList);
}

function sortList(list) {
  // sorting the list that is received, before displaying it

  // sort by chosen option
  list.sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy]);
  });
  displayList(list);
}

function changeSortBy() {
  // change the value by which the list is selected
  if (nameBtn.checked) {
    sortBy = "name";
  } else if (lastNameBtn.checked) {
    sortBy = "lastName";
  } else sortBy = "house";
  // sorting the filtered list
  filterList();
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

  //initiate displayModal
  //displayModal(person);

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function displayModal(person) {
  //show modal when the name is clicked
  person.addEventListener("click", console.log(person));
}

//prototype Person
const Person = {
  name: "-name-",
  lastName: "-last-name-",
  house: "-house-"
};
