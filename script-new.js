"use strict";

window.addEventListener("DOMContentLoaded", start);

const root = document.documentElement;
const IgaId = create_UUID();
const people = [
  {
    name: "Iga",
    lastName: "Naskret",
    middleName: "-middle-name-",
    nick: "-nick-",
    house: "Ravenclaw",
    gender: "girl",
    blood: "-blood-",
    id: IgaId,
    prefect: false
  }
];
let filteredList = [];
const expelled = [];
const prefects = [];
let clickedStudent;
const family = {};
let myLink = "https://petlatkea.dk/2019/hogwartsdata/students.json";
let bloodStatusLink = "https://petlatkea.dk/2019/hogwartsdata/families.json";
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
  modal.addEventListener("click", clickSomething);

  loadJSON();
}

function loadJSON() {
  fetch(myLink)
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      splitJSON(jsonData);
      loadFamilyJSON();
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
    person.id = create_UUID();
    person.prefect = false;
    person.inquisit = false;
    person.gender = jsonObject.gender;

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
}

function loadFamilyJSON() {
  fetch(bloodStatusLink)
    .then(response => response.json())
    .then(jsonBloodData => {
      prepareBloodObject(jsonBloodData);
      filterList();
    });
}

function prepareBloodObject(jsonBloodData) {
  //Interpret jsonObject into student properties
  family.halfBlood = jsonBloodData.half;
  family.pureBlood = jsonBloodData.pure;
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
  // check which filtering option is checked
  const value = houseFilter[houseFilter.selectedIndex].value;

  // if all then pass to sorting, else filter by that house
  if (value === "all") {
    filteredList = people.filter(student => {
      return true;
    });
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
  sortList();
}

function sortList() {
  // sorting the list that is received, before displaying it
  if (sortBy != "") {
    // sort by chosen option
    filteredList.sort((a, b) => {
      return a[sortBy].localeCompare(b[sortBy]);
    });
  }
  displayList(filteredList);
}

function changeSortBy() {
  // change the value by which the list is selected
  if (nameBtn.checked) {
    sortBy = "name";
  } else if (lastNameBtn.checked) {
    sortBy = "lastName";
  } else sortBy = "house";
  // sorting the filtered list
  sortList();
}

function displayList(people) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  people.forEach(displayPerson);
}

function displayPerson(person, index) {
  // create clone
  const clone = document
    .querySelector("template#person")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = person.name;
  clone.querySelector("[data-field=last-name]").textContent = person.lastName;
  clone.querySelector("[data-field=house]").textContent = person.house;

  const prefect = clone.querySelector("[data-field=prefect]");
  const inquisit = clone.querySelector("[data-field=inquisit]");
  let name = clone.querySelector("[data-field=details]");

  prefect.dataset.attribute = person.id;
  inquisit.dataset.attribute = person.id;

  prefect.addEventListener("click", makePrefect);

  inquisit.addEventListener("click", makeInquisit);

  //side information
  document.querySelector("#nr-of-students").textContent = people.length;

  document.querySelectorAll("[data-field=house-counter]").forEach(field => {
    const value = field.dataset.attribute;
    field.textContent = countStudentsInHouse(value);
  });

  //blood status
  // if (family.halfBlood.includes(`${person.lastName}`)) {
  //   clone.querySelector("[data-field=blood]").textContent = "halfblood";
  // } else if (family.pureBlood.includes(`${person.lastName}`)) {
  //   clone.querySelector("[data-field=blood]").textContent = "pureblood";
  // } else {
  //   clone.querySelector("[data-field=blood]").textContent =
  //     "non-magical parents";
  // }

  //hacked blood status
  if (family.halfBlood.includes(`${person.lastName}`)) {
    person.blood = "pureblood";
    clone.querySelector("[data-field=blood]").textContent = "pureblood";
  } else if (family.pureBlood.includes(`${person.lastName}`)) {
    let randomCounter = Math.floor(Math.random() * 3);
    if (randomCounter == 1) {
      person.blood = "pureblood";
      clone.querySelector("[data-field=blood]").textContent = "pureblood";
    } else if (randomCounter == 2) {
      person.blood = "muggleborn";
      clone.querySelector("[data-field=blood]").textContent = "muggleborn";
    } else {
      person.blood = "halfblood";
      clone.querySelector("[data-field=blood]").textContent = "halfblood";
    }
  } else {
    person.blood = "pureblood";
    clone.querySelector("[data-field=blood]").textContent = "pureblood";
  }

  // initiate displayModal
  name.addEventListener("click", displayModal);

  function displayModal(event) {
    clickedStudent = event.target.parentElement.parentElement;
    const modalName = document.querySelector("[data-field=modal-name]");
    const modalHouse = document.querySelector("[data-field=modal-house]");
    const modalImg = document.querySelector("[data-field=modal-img]");
    const removeBtn = document.querySelector("[data-action=remove]");
    document.querySelector("[data-field=modal-blood]").textContent =
      " " + person.blood;
    if (person.inquisit == true) {
      document.querySelector("[data-field=modal-inq]").textContent = " YES";
    } else {
      document.querySelector("[data-field=modal-inq]").textContent = " NO";
    }

    if (person.prefect == true) {
      document.querySelector("[data-field=modal-prefect]").textContent =
        person.name + " is a prefect";
    } else {
      document.querySelector("[data-field=modal-prefect]").textContent =
        person.name + " is not a prefect";
    }

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
    removeBtn.dataset.index = index;
    removeBtn.dataset.attribute = person.id;
    // badge img path
    document.querySelector("[data-field=modal-badge]").src =
      "prototype/img/" + person.house.toLowerCase() + ".png";

    // img path
    modalImg.src =
      "images/" +
      person.lastName.toLowerCase() +
      "_" +
      person.name.substring(0, 1).toLowerCase() +
      ".png";
    // if there are two people with the same last name or no picture or last name wit a dash
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
      } else if (i == 1) {
        let secondLastName = person.lastName.slice(
          person.lastName.indexOf("-") + 1
        );
        modalImg.src =
          "images/" +
          secondLastName.toLowerCase() +
          "_" +
          person.name.substring(0, 1).toLowerCase() +
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

// modal CSS themes
function modalTheme(house) {
  root.dataset.theme = house;
}

// src: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

// expelling students
function clickSomething(event) {
  let element = event.target;
  if (element.dataset.action === "remove") {
    const clickedId = element.dataset.attribute;
    if (clickedId == IgaId) {
      document.querySelector(".nasty").classList.remove("hide");
      let audio = new Audio("hptheme_01.mp3");
      audio.play();
      setTimeout(() => {
        document.querySelector(".nasty").classList.add("hide");
        audio.pause();
        audio.currentTime = 0;
      }, 8500);
    } else {
      function findById(arr, index) {
        function findId(person) {
          if (index === person.id) {
            return true;
          } else {
            return false;
          }
        }
        return arr.findIndex(findId);
      }
      const listId = findById(people, clickedId);
      const filteredListId = findById(filteredList, clickedId);
      const prefectsId = findById(prefects, clickedId);
      prefects.splice(prefectsId, 1);
      people[listId].prefect = false;
      filteredList[filteredListId].prefect = false;

      expelled.push(filteredList[filteredListId]);
      let i = expelled.length - 1;
      const element = document.querySelector("#expelled-names");
      if (i == 0) {
        const firstLine = document.createElement("h3");
        firstLine.textContent = "YOU HAVE EXPELLED:";
        element.appendChild(firstLine);
        const expelledP = document.createElement("p");
        expelledP.textContent = expelled[i].name + " " + expelled[i].lastName;
        element.appendChild(expelledP);
      } else {
        const expelledP = document.createElement("p");
        expelledP.textContent = expelled[i].name + " " + expelled[i].lastName;
        element.appendChild(expelledP);
      }

      filteredList.splice(filteredListId, 1);
      people.splice(listId, 1);

      modal.classList.add("hide");
      setTimeout(() => {
        clickedStudent.classList.add("expelled");
      }, 800);
      setTimeout(() => {
        clickedStudent.remove();
      }, 3100);
    }
  }
  //side information
  document.querySelector("#nr-of-students").textContent = people.length;
  document.querySelector("#nr-of-expelled").textContent = expelled.length;
  document.querySelectorAll("[data-field=house-counter]").forEach(field => {
    const value = field.dataset.attribute;
    field.textContent = countStudentsInHouse(value);
  });
}

function countStudentsInHouse(house) {
  let houseCounter = 0;
  for (let i = 0; i < people.length; i++) {
    if (people[i].house == house) {
      houseCounter++;
    }
  }
  return houseCounter;
}

//making prefects
function makePrefect(event) {
  // who is the person we clicked
  let element = event.target;
  const clickedId = element.dataset.attribute;

  function findById(arr, index) {
    function findId(person) {
      if (index === person.id) {
        return true;
      } else {
        return false;
      }
    }
    return arr.findIndex(findId);
  }
  const listId = findById(people, clickedId);
  const filteredListId = findById(filteredList, clickedId);
  const prefectsId = findById(prefects, clickedId);
  const personHouse = people[listId].house;
  let counter = 0;
  let currentPrefects = [];

  for (let i = 0; i < prefects.length; i++) {
    if (personHouse == prefects[i].house) {
      counter++;
      currentPrefects.push(prefects[i]);
    }
  }

  if (
    people[listId].prefect == true ||
    filteredList[filteredListId].prefect == true
  ) {
    people[listId].prefect = false;
    filteredList[filteredListId].prefect = false;
    prefects.splice(prefectsId, 1);
    event.target.classList.add("grayscale");
  } else if (counter < 2) {
    people[listId].prefect = true;
    filteredList[filteredListId].prefect = true;
    prefects.push(people[listId]);
    console.table(prefects);
    event.target.classList.remove("grayscale");
  } else {
    alert(
      `There can only be two prefects of each house! Revoke the prefect status from ${currentPrefects[0].name} or ${currentPrefects[1].name}!`
    );
  }
}

//making inquisitors
function makeInquisit(event) {
  // who is the person we clicked
  let element = event.target;
  const clickedId = element.dataset.attribute;
  function findById(arr, index) {
    function findId(person) {
      if (index === person.id) {
        return true;
      } else {
        return false;
      }
    }
    return arr.findIndex(findId);
  }
  const listId = findById(people, clickedId);
  const filteredListId = findById(filteredList, clickedId);
  const personHouse = people[listId].house;
  const personBlood = people[listId].blood;
  if (
    people[listId].inquisit == true ||
    filteredList[filteredListId].inquisit == true
  ) {
    people[listId].inquisit = false;
    filteredList[filteredListId].inquisit = false;
    event.target.classList.add("grayscale");
  } else if (personBlood == "pureblood") {
    people[listId].inquisit = true;
    filteredList[filteredListId].inquisit = true;
    event.target.classList.remove("grayscale");
    setTimeout(() => {
      people[listId].inquisit = false;
      filteredList[filteredListId].inquisit = false;
      event.target.classList.add("grayscale");
    }, 3000);
  } else if (personHouse == "Slytherin") {
    people[listId].inquisit = true;
    filteredList[filteredListId].inquisit = true;
    event.target.classList.remove("grayscale");
    setTimeout(() => {
      people[listId].inquisit = false;
      filteredList[filteredListId].inquisit = false;
      event.target.classList.add("grayscale");
    }, 3000);
  } else {
    alert(
      `Only pureblooded and students from Slytherin can have Inquisitorial status!`
    );
  }
}

//prototype Person
const Person = {
  name: "-name-",
  lastName: "-last-name-",
  middleName: "-middle-name-",
  nick: "-nick-",
  house: "-house-",
  inquisit: "-inquisit-",
  blood: "-blood-",
  gender: "-gender-",
  id: "-id-",
  prefect: "-prefect-"
};
