import Snackbar from "node-snackbar";
import store from "@/store/store";
import { api } from "@/utils";

(async () => {
  const newAchievements = async () => {
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
        backgroundColor: "rgba(100,100,0,0.3)",
        duration: 0,
        pos: undefined,
        customClass: "achievement-popup",
        onActionClick: async () => {
          await api.post("/api/achievements/new", {
            body: JSON.stringify({ name })
          });
          const user = await api.get("/api/user");
          if (!user.err) {
            store.commit("auth/setAuth", user.data);
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

    setTimeout(newAchievements, 30 * 1000);
  };

  newAchievements();

  const thankful = await api.get("/api/achievements/thankful");
  if (!thankful.err && !thankful.data) {
    Snackbar.show({
      text: "Welcome to QR-Hunt!",
      actionText: "Thanks! <i class='fas fa-comment'></i>",
      actionTextColor: "#f66496",
      pos: "top-center",
      onActionClick: async () => {
        Snackbar.show({
          text: `<b>Yeeey!</b><br/> You are so kind!`,
          textColor: "#f66496",
          actionText: "<i class='fas fa-heart fa-2x'></i>",
          actionTextColor: "#f66496",
          pos: "top-center"
        });
        await api.post("/api/achievements/thankful");

        setTimeout(newAchievements, 5 * 1000);
      }
    });
  }
})();
