"use strict";

window.addEventListener("DOMContentLoaded", start);

const root = document.documentElement;
const people = [];
let myLink = "https://petlatkea.dk/2019/hogwartsdata/students.json";
const houseFilter = document.querySelector("#house-filter");
const nameBtn = document.querySelector("#name-btn");
const lastNameBtn = document.querySelector("#last-name-btn");
const houseBtn = document.querySelector("#house-btn");
let sortBy = "";
const modal = document.querySelector(".modal");
const close = document.querySelector(".close-btn");

function start() {
  // Event-listeners to filter and sort buttons
  houseFilter.addEventListener("change", filterList);
  nameBtn.addEventListener("click", changeSortBy);
  lastNameBtn.addEventListener("click", changeSortBy);
  houseBtn.addEventListener("click", changeSortBy);
  // event listener close the modal if "x" is clicked
  close.addEventListener("click", closeInfo);

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
    // clean up the data
    jsonObject.fullname = trim(jsonObject.fullname);
    jsonObject.house = trim(jsonObject.house);
    // Interpret jsonObject into Person properties
    const text = jsonObject.fullname.split(" ");
    //middle/ nick name check
    cleanName(text);

    function cleanName(text) {
      //if there's no last name
      if (text[1] == undefined) {
        person.lastName = "unknown";
      }
      //if there are just two names
      else if (text[2] == undefined) {
        person.lastName = text[1];
      }
      // if there's a nick
      else if (text[1][0] == '"') {
        person.nick = text[1];
        person.nick = person.nick.slice(1);
        person.nick = person.nick.slice(0, person.nick.length - 1);
        person.lastName = text[2];
      }
      // if there's a middle name
      else {
        person.middleName = text[1];
        person.lastName = text[2];
      }
    }

    person.name = text[0];
    person.house = jsonObject.house;

    person.name = capitalize(person.name);
    person.lastName = capitalize(person.lastName);
    if (person.middleName != "-middle-name-") {
      person.middleName = capitalize(person.middleName);
    }
    if (person.nick != "-nick-") {
      person.nick = capitalize(person.nick);
    }
    person.house = capitalize(person.house);

    people.push(person);
  });

  filterList();
}

function trim(word) {
  if (word[0] == " ") {
    word = word.slice(1);
  }
  let last = word.charAt(word.length - 1);
  if (last == " ") {
    word = word.slice(0, word.length - 1);
  }
  return word;
}

function capitalize(word) {
  word = word.toLowerCase();
  let capitalizedWord = " ";
  //if includes "-" capitalize properly
  if (word.includes("-")) {
    let dash = word.indexOf("-") + 1;
    let capitalizedWord =
      word.substring(0, 1).toUpperCase() +
      word.substring(1, dash) +
      word.substring(dash, dash + 1).toUpperCase() +
      word.substring(dash + 1);
    return capitalizedWord;
  } else {
    let capitalizedWord = word.substring(0, 1).toUpperCase() + word.slice(1);
    return capitalizedWord;
  }
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
  if (sortBy != "") {
    // sort by chosen option
    list.sort((a, b) => {
      return a[sortBy].localeCompare(b[sortBy]);
    });
  }
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
  // clone.querySelector("[data-field=middle-name]").textContent =
  //   person.middleName;
  // clone.querySelector("[data-field=nick]").textContent = person.nick;
  clone.querySelector("[data-field=house]").textContent = person.house;

  let name = clone.querySelector("tr");

  // initiate displayModal
  name.addEventListener("click", displayModal);

  function displayModal() {
    const modalName = document.querySelector(".modal-name");
    const modalHouse = document.querySelector(".modal-house");
    const modalImg = document.querySelector(".modal-img");
    if (person.middleName != "-middle-name-") {
      modalName.textContent =
        person.name + " " + person.middleName + " " + person.lastName;
    } else if (person.nick != "-nick-") {
      modalName.textContent =
        person.name + ' "' + person.nick + '" ' + person.lastName;
    } else {
      modalName.textContent = person.name + " " + person.lastName;
    }
    modalHouse.textContent = person.house;
    // img path
    modalImg.src =
      "images/" +
      person.lastName.toLowerCase() +
      "_" +
      person.name.substring(0, 1).toLowerCase() +
      ".png";
    // if there are two people with the same last name or no picture
    let i = 0;
    modalImg.addEventListener("error", imgError);
    function imgError() {
      if (i == 0) {
        modalImg.src =
          "images/" +
          person.lastName.toLowerCase() +
          "_" +
          person.name.toLowerCase() +
          ".png";
        i++;
      }
    }
    //set theme
    modalTheme(person.house);
    modal.classList.remove("hide");
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

// close modal
function closeInfo() {
  modal.classList.add("hide");
}

function modalTheme(house) {
  root.dataset.theme = house;
}

//prototype Person
const Person = {
  name: "-name-",
  lastName: "-last-name-",
  middleName: "-middle-name-",
  nick: "-nick-",
  house: "-house-"
};
