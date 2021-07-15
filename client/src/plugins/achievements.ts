import Snackbar from "node-snackbar";
import store from "@/store/store";
import { api } from "@/utils";
import EventBus from "./event-bus";
import { EVENT_TYPE } from "@/constants";

export const newAchievements = async () => {
  // Don't show achievements when in intro mode
  if (new URLSearchParams(window.location.search).get("intro")) return;

  // Get new achievement
  const achievement = await api.get("/api/achievements/new");
  if (!achievement.err && achievement.data) {
    const { name, title, icon } = achievement.data;
    Snackbar.show({
      text: `
        <div class="achievement-top"><p>Great work!</p></div>
        You've unlocked a new achievement!
        <br/>
        <h2>${title || name}</h2>
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
        await api.post("/api/achievements/new", {
          body: JSON.stringify({ name })
        });
        const user = await api.get("/api/user");
        if (!user.err) {
          store.commit("user/setAuth", user.data);
        }

        const achievements = await api.get("/api/achievements");
        if (!achievements.err) {
          store.commit("achievements/setAchievements", achievements.data);
        }
        // @ts-ignore
        Snackbar.close();

        setTimeout(newAchievements, 3 * 1000);
      }
    });
  }
};

setTimeout(newAchievements, 2 * 1000);
EventBus.$on(EVENT_TYPE.API_REQUEST_UPDATE, () => {
  setTimeout(newAchievements, 1000);
});

const isThankful = async () => {
  if (Math.random() > 0.1) return;

  const thankful = await api.get("/api/achievements/thankful");
  if (!thankful.err && !thankful.data) {
    Snackbar.show({
      text: "Do you enjoy QR-Hunt?",
      pos: "top-center",
      actionText: "Yes! <i class='fas fa-thumbs-up'></i>",
      actionTextColor: "",
      onActionClick: () => api.post("/api/achievements/thankful")
    });
  }
};

isThankful();
