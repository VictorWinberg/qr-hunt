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
              element: document.querySelector("#position-button"),
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
              title: "Logout",
              element: document.querySelector(
                ".header-icon[href='/auth/logout']"
              ),
              intro: "Click here to log out from QR Hunt"
            },
            {
              title: "User",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "Ready to proceed to the user page?"
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
              element: document.querySelector(".user-achievements__title"),
              intro: "Here will all your achievements be shown"
            },
            {
              title: "Friends",
              element: document.querySelector(".friends__title"),
              intro: "Here will all your friends be shown"
            },
            {
              title: "Delete",
              element: document.querySelector(".user-remove"),
              intro: "This button will delete all of your data!"
            },
            {
              title: "That's all! 👋",
              element: document.querySelector(".help-me"),
              intro:
                "If your want this guide again, please press this help button"
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
