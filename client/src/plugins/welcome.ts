import dayjs from "dayjs";
import Snackbar from "node-snackbar";

const delay = 3 * 1000;

const welcome = () => {
  const latestWelcome = localStorage.getItem("latestWelcome");
  localStorage.setItem("latestWelcome", dayjs().toJSON());

  let recruit;
  if (!dayjs(latestWelcome).isValid()) {
    recruit = true;
  } else if (dayjs().diff(latestWelcome, "week") > 1) {
    recruit = false;
  } else {
    return;
  }

  Snackbar.show({
    text: `
      <div class="achievement-top">
        <p>${recruit ? "Welcome!" : "Welcome back!"}</p>
      </div>
      ${
        recruit
          ? "It's a pleasure and an honor to have you join the hunt!"
          : "So glad you're back! We missed you!"
      }
      <i class="fal fa-grin-hearts"></i>
      <br/>
      <h3>Let the QR-Hunt begin! <i class="fas fa-helmet-battle"></i> <i class="fas fa-fist-raised"></i></h3>
      <img width='25%' src='${require("@/assets/logo.svg")}'/>
    `,
    textColor: "black",
    actionText: "enter <i class='far fa-swords'></i>",
    actionTextColor: "white",
    backgroundColor: "rgba(36,36,36,0.9)",
    duration: 0,
    pos: undefined,
    customClass: "achievement-popup",
    onActionClick: async () => {
      // @ts-ignore
      Snackbar.close();
    }
  });
};

setTimeout(welcome, delay);
