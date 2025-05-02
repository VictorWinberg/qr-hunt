import introJs from "intro.js";
import "intro.js/introjs.css";
import i18n from "./i18n";
import { translations, SupportedLocale } from "./intro-translations";

setTimeout(() => {
  const { locale } = i18n;
  const t = translations[locale as SupportedLocale];

  switch (new URLSearchParams(window.location.search).get("intro")) {
    case "start":
      return introJs()
        .setOptions({
          showProgress: true,
          disableInteraction: false,
          nextLabel: t.nextLabel,
          prevLabel: t.prevLabel,
          doneLabel: t.doneLabel,
          steps: [
            {
              title: t.start.startTitle,
              intro: t.start.startIntro({
                logo: `<img width='50%' src='${require("@/assets/logo.svg")}' style="display: block; margin: auto;"/>`
              })
            },
            {
              title: t.start.mapTitle,
              element: document.querySelector(".vue-map-container"),
              intro: t.start.mapIntro({
                icon: `<img src='${require("@/assets/google.svg")}'/>`
              })
            },
            {
              title: t.start.qrTitle,
              element: document.querySelector(".vue-map-container"),
              intro: t.start.qrIntro({
                iconFree: `<img src='${require("@/assets/qr-spot-marker--free.svg")}' style='vertical-align: middle'/>`,
                iconNew: `<img src='${require("@/assets/qr-spot-marker--new.svg")}' style='vertical-align: middle'/>`,
                iconUsed: `<img src='${require("@/assets/qr-spot-marker--used.svg")}' style='vertical-align: middle'/>`
              })
            },
            {
              title: t.start.scanTitle,
              element: document.querySelector("#qrcode"),
              intro: t.start.scanIntro({
                qrCode: `<img width='50%' src='/print-qr-code.png' style='display: block; margin: auto;'/>`
              }),
              position: "top"
            },
            {
              title: t.start.youTitle,
              element: document.querySelector("#position-button"),
              intro: t.start.youIntro({
                icon: `<img src='${require("@/assets/position-button.svg")}' style='vertical-align: middle'/>`
              }),
              position: "top"
            },
            {
              title: t.start.mapPageTitle,
              element: document.querySelector(".header-title"),
              intro: t.start.mapPageIntro
            },
            {
              title: t.start.settingsTitle,
              element: document.querySelector(".header-icon[href='/user']"),
              intro: t.start.settingsIntro
            },
            {
              title: t.start.proceedTitle,
              element: document.querySelector(".header-icon[href='/user']"),
              intro: t.start.proceedIntro
            }
          ]
        })
        .onexit(() => (window.location.href = window.location.pathname))
        .oncomplete(() =>
          setTimeout(() => (window.location.href = "/user/?intro=user"), 10)
        )
        .start();
    case "user":
      return introJs()
        .setOptions({
          showProgress: true,
          disableInteraction: false,
          nextLabel: t.nextLabel,
          prevLabel: t.prevLabel,
          doneLabel: t.doneLabel,
          steps: [
            {
              title: t.user.userTitle,
              element: document.querySelector(".user-wrapper"),
              intro: t.user.userIntro
            },
            {
              title: t.user.profileTitle,
              element: document.querySelector(".user-header"),
              intro: t.user.profileIntro
            },
            {
              title: t.user.levelTitle,
              element: document.querySelector(".user-xp"),
              intro: t.user.levelIntro
            },
            {
              title: t.user.achievementsTitle,
              element: document.querySelector(".tabs .fa.fa-award"),
              intro: t.user.achievementsIntro,
              position: "top"
            },
            // {
            //   title: "Friends",
            //   element: document.querySelector(".tabs ..?"),
            //   intro: "Click here to see your friends and their stats",
            //   position: "top"
            // },
            {
              title: t.user.leaderboardTitle,
              element: document.querySelector(".tabs .fa.fa-trophy"),
              intro: t.user.leaderboardIntro,
              position: "top"
            },
            {
              title: t.user.settingsTitle,
              element: document.querySelector(".tabs .fa.fa-cog"),
              intro: t.user.settingsIntro,
              position: "top"
            },
            {
              title: t.user.helpTitle,
              element: document.querySelector(".help-me"),
              intro: t.user.helpIntro
            },
            {
              title: t.user.logoutTitle,
              element: document.querySelector(".log-out"),
              intro: t.user.logoutIntro
            },
            {
              title: t.user.deleteTitle,
              element: document.querySelector(".user-remove"),
              intro: t.user.deleteIntro
            },
            {
              title: t.user.endTitle,
              element: document.querySelector(".header-title"),
              intro: t.user.endIntro
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
}, 1000);
