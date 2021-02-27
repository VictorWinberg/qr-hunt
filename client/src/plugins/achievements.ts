import Snackbar from "node-snackbar";
import store from "@/store";
import { api } from "@/utils";

(async () => {
  const newAchievements = async () => {
    const achievement = await api.get("/api/achievements/new");
    if (!achievement.err && achievement.data) {
      const { name, title } = achievement.data;
      Snackbar.show({
        text: `<b>-Achievement-</b><br/> ${title || name}`,
        actionText: "<i class='fas fa-hand-holding-heart fa-2x'></i>",
        actionTextColor: "#32a852",
        duration: 10 * 1000,
        pos: "top-center",
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
