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
                "<img width='50%' src='/print-qr-code.png' style='display: block; margin: auto;'/>",
              position: "top"
            },
            {
              title: "You",
              element: document.querySelector("#position-button"),
              intro:
                "Tip: click on the position button to center your location<br/><br/>" +
                `<i>This icon: <img src='${require("@/assets/position-button.svg")}' style='vertical-align: middle'/>`,
              position: "top"
            },
            {
              title: "Map page",
              element: document.querySelector(".header-title"),
              intro: "This button redirects to the map page (you are here now)"
            },
            {
              title: "User and Settings",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "This button redirects to the user and settings page"
            },
            {
              title: "Proceed?",
              element: document.querySelector(".header-icon[href='/user']"),
              intro: "Ready to proceed to the user and settings page?"
            }
          ]
        })
        .onexit(() => {
          window.location.href = window.location.pathname;
        })
        .oncomplete(() => {
          setTimeout(() => {
            window.location.href = "/user/?intro=user";
          }, 10);
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
                "Here you can see your current level, " +
                "achievements, friends, settings and more"
            },
            {
              title: "User profile",
              element: document.querySelector(".user-header"),
              intro: "Here is your user profile. Say hello to yourself! 👋"
            },
            {
              title: "User level",
              element: document.querySelector(".user-xp"),
              intro: "Here is your user level and xp shown"
            },
            {
              title: "Achievements",
              element: document.querySelector(".tabs .fa.fa-award"),
              intro: "Click here to see your achievements",
              position: "top"
            },
            // {
            //   title: "Friends",
            //   element: document.querySelector(".tabs ..?"),
            //   intro: "Click here to see your friends and their stats",
            //   position: "top"
            // },
            {
              title: "Leaderboard",
              element: document.querySelector(".tabs .fa.fa-trophy"),
              intro:
                "Click here to see the current leaderboard and their stats",
              position: "top"
            },
            {
              title: "Settings",
              element: document.querySelector(".tabs .fa.fa-cog"),
              intro:
                "Click here to see user settings - " +
                "help, log out and delete account",
              position: "top"
            },
            {
              title: "Help",
              element: document.querySelector(".help-me"),
              intro:
                "If your want this guide again, please press this help button"
            },
            {
              title: "Logout",
              element: document.querySelector(".log-out"),
              intro: "Click here to log out"
            },
            {
              title: "Delete",
              element: document.querySelector(".user-remove"),
              intro:
                "This button will delete your account " +
                "and all of your data!"
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
          }, 10);
        })
        .onchange(el => {
          const doClick = ["fa-award", "fa-trophy", "fa-cog"];
          if (doClick.some(cl => el.className.includes(cl))) {
            el.click();
          }
        })
        .start();
  }
}, 100);
