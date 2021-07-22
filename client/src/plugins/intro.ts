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
              title: "Getting started! 👋",
              intro:
                `<img width='50%' src='${require("@/assets/logo.svg")}' style="display: block; margin: auto;"/><br/>` +
                "Hello and welcome to QR Hunt, " +
                "the app that let's you hunt down QR codes, " +
                "collect points and compete against your friends!"
            },
            {
              title: "Map",
              element: document.querySelector(".vue-map-container"),
              intro:
                `Here in the center is the <img src='${require("@/assets/google.svg")}'/>-Maps, ` +
                "where all the QR codes can be found"
            },
            {
              title: "QR Codes",
              element: document.querySelector(".vue-map-container"),
              intro: `There are three different types of QR codes on the map<br/>
                <img src='${require("@/assets/qr-spot-marker--free.svg")}' style='vertical-align: middle'/> Regular QR (collect today!)<br/>
                <img src='${require("@/assets/qr-spot-marker--new.svg")}' style='vertical-align: middle'/> New QR (collect today!)<br/>
                <img src='${require("@/assets/qr-spot-marker--used.svg")}' style='vertical-align: middle'/> Used QR (collect tomorrow)
              `
            },
            {
              title: "Scan",
              element: document.querySelector("#qrcode"),
              intro:
                "Click down here to scan a QR code you found. <br/><br/>" +
                "<i>They look like image below, with a magnet attached to a metal object:</i> <br/><br/>" +
                "<img width='50%' src='/print-qr-code.png' style='display: block; margin: auto;'/>"
            },
            {
              title: "You",
              element: document.querySelector("#position-button"),
              intro:
                "Tip: click on the position button to center your location<br/><br/>" +
                `<i>This icon: <img src='${require("@/assets/position-button.svg")}' style='vertical-align: middle'/>`,
              position: "left"
            },
            {
              title: "Map page",
              element: document.querySelector(".header-title"),
              intro: "This button redirects to the map page (you are here now)"
            },
            {
              title: "User page",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "This button redirects to the user page"
            },
            {
              title: "Logout",
              element: document.querySelector(
                ".header-icon[href='/auth/logout']"
              ),
              intro: "Click here to log out"
            },
            {
              title: "User page",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "Ready to proceed to the user page?"
            }
          ]
        })
        .onexit(() => {
          window.location.href = window.location.pathname;
        })
        .oncomplete(() => {
          setTimeout(() => {
            window.location.href = "/user/?intro=user";
          }, 0);
        })
        .start();
    case "user":
      return introJs()
        .setOptions({
          showProgress: true,
          disableInteraction: false,
          doneLabel: "Yes",
          steps: [
            {
              title: "User page! 👋",
              element: document.querySelector(".user-wrapper"),
              intro:
                "This is your user page! " +
                "Here you can see your current level, achievements, friends, settings and more"
            },
            {
              title: "User level",
              element: document.querySelector(".user-xp"),
              intro: "Here is your user level and xp shown",
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
              intro: "Here will all your friends and their levels be shown"
            },
            {
              title: "Settings",
              element: document.querySelector(".settings__title"),
              intro: "Here is are all settings shown"
            },
            {
              title: "Delete",
              element: document.querySelector(".user-remove"),
              intro: "This button will delete all of your data!"
            },
            {
              title: "Help",
              element: document.querySelector(".help-me"),
              intro:
                "If your want this guide again, please press this help button"
            },
            {
              title: "That's all! 👋",
              element: document.querySelector(".header-title"),
              intro: "Ready to go back to the map page?"
            }
          ]
        })
        .onexit(() => {
          window.location.href = window.location.pathname;
        })
        .oncomplete(() => {
          setTimeout(() => {
            window.location.href = "/";
          }, 0);
        })
        .start();
  }
}, 100);
