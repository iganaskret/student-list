"use strict";

// link for info
let myLink = "http://petlatkea.dk/2019/students1991.json";

const template = document.querySelector("template").content;
const parent = document.querySelector("main");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close-btn");
const root = document.documentElement;
const arrLastName = [];
let arrFirstName = [];
const arrHouse = [];
let i = 0;

// window.DomContentLoaded to trigger start function
document.addEventListener("DOMContentLoaded", start);

function start() {
  // function that fetches a JSON file
  function ShowStudents(link) {
    fetch(link)
      .then(e => e.json())
      .then(data => show(data));
  }

  // function that displays fetched data as an list
  function show(data) {
    data.forEach(object => {
      // clone the template

      const clone = template.cloneNode(true);

      // populate it
      const name = clone.querySelector(".name");
      const house = clone.querySelector(".house");
      arrLastName[i] = object.fullname.split(" ")[1];
      arrFirstName[i] = object.fullname.split(" ")[0];
      arrHouse[i] = object.house;
      i++;

      name.textContent = object.fullname;
      house.textContent = object.house;

      // append to DOM
      parent.appendChild(clone);

      // event listener if the student name is clicked
      name.addEventListener("click", displayInfo);
      house.addEventListener("click", displayInfo);

      // display modal with info from JSON + photo
      function displayInfo() {
        const modalName = document.querySelector(".modal-name");
        const modalHouse = document.querySelector(".modal-house");
        modalName.textContent = object.fullname;
        modalHouse.textContent = object.house;
        if (modalHouse.textContent == "Gryffindor") {
          root.dataset.theme = "red";
        } else if (modalHouse.textContent == "Ravenclaw") {
          root.dataset.theme = "blue";
        } else if (modalHouse.textContent == "Hufflepuff") {
          root.dataset.theme = "orange";
        } else {
          root.dataset.theme = "green";
        }
        modal.classList.remove("hide");
        console.log("dziala");
      }
      // event listener close the modal if "x" is clicked
      close.addEventListener("click", closeInfo);

      function closeInfo() {
        modal.classList.add("hide");
        console.log("dziala2");
      }
    });
  }

  ShowStudents(myLink);

  /// ----------------------- Filter house

  const page = document.documentElement;
  const root = document.documentElement;
  const theme = document.querySelector("#theme");

  function show_selected() {
    const value = theme[theme.selectedIndex].value;
    if (value == "red") {
      document.querySelectorAll("article").forEach(article => {
        article.style.display = "block";
        if (article.querySelector(".house").textContent != "Gryffindor") {
          article.style.display = "none";
          // root.dataset.theme = "dark";
        }
      });
    } else if (value == "blue") {
      document.querySelectorAll("article").forEach(article => {
        article.style.display = "block";
        if (article.querySelector(".house").textContent != "Ravenclaw") {
          article.style.display = "none";
        }
      });
    } else if (value == "brown") {
      document.querySelectorAll("article").forEach(article => {
        article.style.display = "block";
        if (article.querySelector(".house").textContent != "Hufflepuff") {
          article.style.display = "none";
        }
      });
    } else if (value == "green") {
      document.querySelectorAll("article").forEach(article => {
        article.style.display = "block";
        if (article.querySelector(".house").textContent != "Slytherin") {
          article.style.display = "none";
        }
      });
    } else if (value == "all") {
      document.querySelectorAll("article").forEach(article => {
        article.style.display = "block";
      });
    }
  }

  theme.addEventListener("change", show_selected);

  /// --------------- end

  function sortFirstName() {
    if (document.querySelector("#first").checked == true) {
      arrFirstName = arrFirstName.sort();
      console.log(arrFirstName);
      document.querySelectorAll("article").forEach(article => {
        article.style.display = "block";
        for (i = 0; i < arrFirstName.length; i++) {
          if (article.querySelector(".name").textContent != arrFirstName[i]) {
            article.style.display = "none";
            console.log(article);
            // root.dataset.theme = "dark";
          }
        }
      });
    }
  }

  // document.querySelector("button").addEventListener("click", sortFirstName());

  document.querySelector("#first").addEventListener("click", function() {
    console.log("hi works");
    sortFirstName();
  });
}
// window.DomContentLoaded to trigger start function

// document.addEventListener("DOMContentLoaded", start);

// link for info

// function that fetches a JSON file
// function that displays fetched data as an list

// event listener if the student name is clicked

// display modal with info from JSON + photo

// event listener close the modal if "x" is clicked

// event listener for sorting buttons

// function for sorting by firstname
// if sort by first name - sort alphabetical

// function for sorting by lastname
// if sort by last name - sort alphabetical

// event listener for list dropdown of houses
