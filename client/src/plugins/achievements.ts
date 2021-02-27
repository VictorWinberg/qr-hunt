import Snackbar from "node-snackbar";
import store from "@/store";
import { api } from "@/utils";

(async () => {
  const thankful = await api.get("/api/achievements/thankful");
  if (!thankful.err && !thankful.data) {
    Snackbar.show({
      text: "Welcome to QR-Hunt!",
      actionText: "Thanks!",
      actionTextColor: "#f66496",
      pos: "top-center",
      onActionClick: () => {
        Snackbar.show({
          text: "YEEEY! You are so kind!",
          textColor: "#f66496",
          pos: "top-center",
          showAction: false
        });
        api.post("/api/achievements/thankful");
      }
    });
  }

  const newAchievements = async () => {
    // @ts-ignore
    if (!store.state.auth.isAuthenticated) return;

    const achievement = await api.get("/api/achievements/new");
    if (!achievement.err && achievement.data) {
      const { name, title } = achievement.data;
      Snackbar.show({
        text: `<b>Achievement:</b> ${title || name}`,
        actionText: "Collect!",
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
        }
      });
    }
    setTimeout(newAchievements, 10 * 1000);
  };

  newAchievements();
})();
