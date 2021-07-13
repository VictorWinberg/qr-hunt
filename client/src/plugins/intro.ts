import introJs from "intro.js";
import "intro.js/introjs.css";

setTimeout(() => {
  switch (new URLSearchParams(window.location.search).get("intro")) {
    case "start":
      return introJs()
        .setOptions({
          showProgress: true,
          disableInteraction: false,
          doneLabel: "Yes",
          steps: [
            {
              title: "Getting started!",
              intro: "Hello and Welcome ...! 👋"
            },
            {
              title: "Map",
              element: document.querySelector(".vue-map-container"),
              intro: "This is the map with all the QR codes to be found"
            },
            {
              title: "You",
              element: document.querySelector("#my-location-button"),
              intro: "Click here to center your location",
              position: "left"
            },
            {
              title: "Scan",
              element: document.querySelector("#qrcode"),
              intro: "This is the scan QR code button"
            },
            {
              title: "User",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "This button redirects to the user page"
            },
            {
              title: "User",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "Ready to proceed to the user page"
            }
          ]
        })
        .oncomplete(() => {
          setTimeout(() => {
            window.location.href = "/user/?intro=user";
          }, 0);
        })
        .onexit(() => {
          window.location.href = window.location.pathname;
        })
        .start();
    case "user":
      return introJs()
        .setOptions({
          showProgress: true,
          steps: [
            {
              title: "Getting started!",
              element: document.querySelector(".user-wrapper"),
              intro: "This is your user page! 👋"
            },
            {
              title: "User level",
              element: document.querySelector(".user-xp"),
              intro: "Here is your user level and xp",
              position: "bottom-middle-aligned"
            },
            {
              title: "Achievements",
              element: document.querySelector(".user-achievements-title"),
              intro: "Here will all your achievements be shown"
            },
            {
              title: "DELETE",
              element: document.querySelector(".user-remove"),
              intro: "This button will delete all of data!"
            },
            {
              title: "End",
              element: document.querySelector(".help-me"),
              intro:
                "That was all, if your want this guide again please press this help button"
            }
          ]
        })
        .onexit(() => {
          window.location.href = window.location.pathname;
        })
        .oncomplete(() => {
          window.location.href = "/user/?intro=user";
        })
        .start();
  }
}, 100);
