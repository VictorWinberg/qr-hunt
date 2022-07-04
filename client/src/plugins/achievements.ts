import Snackbar from "node-snackbar";
import { EVENT_TYPE } from "@/constants";
import { api } from "@/utils";
import EventBus from "./event-bus";

const delay = 3 * 1000;

export const newAchievements = async () => {
  // Don't show achievements when in intro mode
  if (new URLSearchParams(window.location.search).get("intro")) return;

  // Get new achievement
  const achievement = await api.get("/api/achievements/new");
  if (!achievement.err && achievement.data) {
    const { name, title, count, icon } = achievement.data;
    const countString =
      count > 3
        ? `${count}th`
        : count === 3
        ? "3rd"
        : count === 2
        ? "2nd"
        : "1st";
    Snackbar.show({
      text: `
        <div class="achievement-top"><p>Great work!</p></div>
        ${count > 1 ? "You got the achievement" : "You got a new achievement"}
        <br/>
        <h2>${title || name}</h2>
        ${count > 1 ? "for the " + countString + " time <br/>" : ""}
        <br/>
        <i class="${icon} fa-2x"></i>
      `,
      textColor: "black",
      actionText: "ok",
      actionTextColor: "white",
      backgroundColor: "rgba(36,36,36,0.9)",
      duration: 0,
      pos: undefined,
      customClass: "achievement-popup",
      onActionClick: async () => {
        await api.put("/api/achievements/new", {
          body: JSON.stringify({ name })
        });

        // @ts-ignore
        Snackbar.close();

        setTimeout(newAchievements, delay);
      }
    });
  }
};

EventBus.$on(EVENT_TYPE.AUTH_CHANGE, ({ isAuthenticated }) => {
  if (isAuthenticated) {
    setTimeout(newAchievements, delay);
  }
});
EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, () => {
  setTimeout(newAchievements, delay);
});

const levelUp = async (lvl: number) => {
  Snackbar.show({
    text: `
    <div class="achievement-top"><p>Level up!</p></div>
    <p style="color: #a67b1e">
      <i class="fas fa-star"></i>
      <i class="fas fa-star fa-2x"></i>
      <i class="fas fa-star"></i>
    </p>
    <h2>Level ${lvl}</h2>
    Congratulations! You achieved a new level!
  `,
    textColor: "black",
    actionText: "ok",
    actionTextColor: "white",
    backgroundColor: "rgba(36,36,36,0.9)",
    duration: 0,
    pos: undefined,
    customClass: "achievement-popup",
    onActionClick: async () => {
      // @ts-ignore
      Snackbar.close();

      setTimeout(newAchievements, delay);
    }
  });
};

EventBus.$on(EVENT_TYPE.LEVEL_UP, (lvl: number) => {
  setTimeout(() => levelUp(lvl), delay);
});

const isThankful = async () => {
  const thankful = await api.get("/api/achievements/thankful");
  if (!thankful.err && !thankful.data) {
    Snackbar.show({
      text: "Do you enjoy QR-Hunt?",
      pos: "top-center",
      actionText: "Yes! <i class='fas fa-thumbs-up'></i>",
      actionTextColor: "",
      onActionClick: () => {
        api.post("/api/achievements/thankful");
        localStorage.setItem("thankful", "true");
      }
    });
  } else if (!thankful.err) {
    localStorage.setItem("thankful", "true");
  }
};

if (Math.random() < 0.1 && !localStorage.getItem("thankful")) {
  setTimeout(isThankful, 30 * 1000);
}
