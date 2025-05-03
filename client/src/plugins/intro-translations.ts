export interface IntroStepTranslations {
  nextLabel: string;
  prevLabel: string;
  doneLabel: string;
  start: {
    startTitle: string;
    startIntro: (args: { logo: string }) => string;
    mapTitle: string;
    mapIntro: (args: { icon: string }) => string;
    qrTitle: string;
    qrIntro: (args: {
      iconFree: string;
      iconNew: string;
      iconUsed: string;
    }) => string;
    scanTitle: string;
    scanIntro: (args: { qrCode: string }) => string;
    youTitle: string;
    youIntro: (args: { icon: string }) => string;
    mapPageTitle: string;
    mapPageIntro: string;
    settingsTitle: string;
    settingsIntro: string;
    proceedTitle: string;
    proceedIntro: string;
  };
  user: {
    userTitle: string;
    userIntro: string;
    profileTitle: string;
    profileIntro: string;
    levelTitle: string;
    levelIntro: string;
    achievementsTitle: string;
    achievementsIntro: string;
    leaderboardTitle: string;
    leaderboardIntro: string;
    settingsTitle: string;
    settingsIntro: string;
    helpTitle: string;
    helpIntro: string;
    logoutTitle: string;
    logoutIntro: string;
    deleteTitle: string;
    deleteIntro: string;
    endTitle: string;
    endIntro: string;
  };
}

export type SupportedLocale = "en" | "sv" | "es";

export const translations: Record<SupportedLocale, IntroStepTranslations> = {
  en: {
    nextLabel: "Next",
    prevLabel: "Back",
    doneLabel: "Yes",
    start: {
      startTitle: "Getting started! 👋",
      startIntro: ({ logo }) =>
        `${logo}<br/>` +
        "Hello and welcome to QR Hunt, the app that lets you hunt down QR codes, collect points and compete against your friends!",
      mapTitle: "Map",
      mapIntro: ({ icon }) =>
        `Here in the center is the ${icon}-Maps, where all the QR codes can be found`,
      qrTitle: "QR Codes",
      qrIntro: ({ iconFree, iconNew, iconUsed }) =>
        "There are three different types of QR codes on the map<br/>" +
        `${iconFree} Regular QR (collect today!)<br/>` +
        `${iconNew} New QR (collect today!)<br/>` +
        `${iconUsed} Used QR (collect tomorrow)`,
      scanTitle: "Scan",
      scanIntro: ({ qrCode }) =>
        "Click down here to scan a QR code you found. <br/><br/>" +
        "<i>They look like image below, with a magnet attached to a metal object:</i> <br/><br/>" +
        `${qrCode}`,
      youTitle: "You",
      youIntro: ({ icon }) =>
        "Tip: click on the position button to center your location<br/><br/>" +
        `<i>This icon: ${icon}`,
      mapPageTitle: "Map page",
      mapPageIntro: "This button redirects to the map page (you are here now)",
      settingsTitle: "User and Settings",
      settingsIntro: "This button redirects to the user and settings page",
      proceedTitle: "Proceed?",
      proceedIntro: "Ready to proceed to the user and settings page?"
    },
    user: {
      userTitle: "User page! 👋",
      userIntro:
        "This is your user page! Here you can see your current level, achievements, friends, settings and more",
      profileTitle: "User profile",
      profileIntro: "Here is your user profile. Say hello to yourself! 👋",
      levelTitle: "User level",
      levelIntro: "Here is your user level and xp shown",
      achievementsTitle: "Achievements",
      achievementsIntro: "Click here to see your achievements",
      leaderboardTitle: "Leaderboard",
      leaderboardIntro:
        "Click here to see the current leaderboard and their stats",
      settingsTitle: "Settings",
      settingsIntro:
        "Click here to see user settings - help, log out and delete account",
      helpTitle: "Help",
      helpIntro: "If you want this guide again, please press this help button",
      logoutTitle: "Logout",
      logoutIntro: "Click here to log out",
      deleteTitle: "Delete",
      deleteIntro: "This button will delete your account and all of your data!",
      endTitle: "That's all! 👋",
      endIntro: "Ready to go back to the map page?"
    }
  },

  sv: {
    nextLabel: "Nästa",
    prevLabel: "Tillbaka",
    doneLabel: "Ja",
    start: {
      startTitle: "Kom igång! 👋",
      startIntro: ({ logo }) =>
        `${logo}<br/>` +
        "Hej och välkommen till QR Hunt, appen där du jagar QR-koder, samlar poäng och tävlar mot dina vänner!",
      mapTitle: "Karta",
      mapIntro: ({ icon }) =>
        `Här i mitten finns ${icon}-Maps, där alla QR-koder kan hittas`,
      qrTitle: "QR-koder",
      qrIntro: ({ iconFree, iconNew, iconUsed }) =>
        "Det finns tre olika typer av QR-koder på kartan<br/>" +
        `${iconFree} Vanlig QR (skanna idag!)<br/>` +
        `${iconNew} Ny QR (skanna idag!)<br/>` +
        `${iconUsed} Använd QR (skanna imorgon)`,
      scanTitle: "Skanna",
      scanIntro: ({ qrCode }) =>
        "Klicka här nere för att skanna en QR-kod du har hittat. <br/><br/>" +
        "<i>De ser ut som bilden nedan, med en magnet fäst vid ett metallföremål:</i> <br/><br/>" +
        `${qrCode}`,
      youTitle: "Du",
      youIntro: ({ icon }) =>
        "Tips: klicka på positionsknappen för att centrera din plats<br/><br/>" +
        `<i>Denna ikon: ${icon}`,
      mapPageTitle: "Karta",
      mapPageIntro: "Den här knappen går till kartan (du är här nu)",
      settingsTitle: "Profil & inställningar",
      settingsIntro: "Den här knappen går till profil och inställningar",
      proceedTitle: "Fortsätt?",
      proceedIntro: "Redo att gå till profil och inställningar?"
    },
    user: {
      userTitle: "Profil och inställningar! 👋",
      userIntro:
        "Detta är din profil! Här kan du se din nivå, prestationer, vänner, inställningar och mer",
      profileTitle: "Användarprofil",
      profileIntro: "Här är din användarprofil. Säg hej till dig själv! 👋",
      levelTitle: "Användarnivå",
      levelIntro: "Här visas din nivå och erfarenhetspoäng",
      achievementsTitle: "Prestationer",
      achievementsIntro: "Klicka här för att se dina prestationer",
      leaderboardTitle: "Topplista",
      leaderboardIntro: "Klicka här för att se topplistan och statistik",
      settingsTitle: "Inställningar",
      settingsIntro:
        "Klicka här för att se inställningar – hjälp, logga ut och radera konto",
      helpTitle: "Hjälp",
      helpIntro: "Om du vill visa guiden igen, klicka på hjälpknappen",
      logoutTitle: "Logga ut",
      logoutIntro: "Klicka här för att logga ut",
      deleteTitle: "Radera",
      deleteIntro: "Denna knapp raderar ditt konto och all din data!",
      endTitle: "Det var allt! 👋",
      endIntro: "Redo att gå tillbaka till kartan?"
    }
  },

  es: {
    nextLabel: "Siguiente",
    prevLabel: "Atrás",
    doneLabel: "Sí",
    start: {
      startTitle: "¡Empecemos! 👋",
      startIntro: ({ logo }) =>
        `${logo}<br/>` +
        "Hola y bienvenido a QR Hunt, la app que te permite encontrar códigos QR, ganar puntos y competir con amigos!",
      mapTitle: "Mapa",
      mapIntro: ({ icon }) =>
        `Aquí en el centro están los ${icon}-Maps, donde se pueden encontrar todos los códigos QR`,
      qrTitle: "Códigos QR",
      qrIntro: ({ iconFree, iconNew, iconUsed }) =>
        `Hay tres tipos diferentes de códigos QR en el mapa<br/>${iconFree} QR normal (¡recoge hoy!)<br/>${iconNew} QR nuevo (¡recoge hoy!)<br/>${iconUsed} QR usado (¡recoge mañana!)`,
      scanTitle: "Escanear",
      scanIntro: ({ qrCode }) =>
        "Haz clic aquí abajo para escanear un código QR que encontraste. <br/><br/>" +
        "<i>Se ven como la imagen de abajo, con un imán pegado a un objeto metálico:</i> <br/><br/>" +
        `${qrCode}`,
      youTitle: "Tú",
      youIntro: ({ icon }) =>
        "Consejo: haz clic en el botón de ubicación para centrar tu posición<br/><br/>" +
        `<i>Este ícono: ${icon}`,
      mapPageTitle: "Página de mapa",
      mapPageIntro:
        "Este botón te lleva a la página de mapa (donde estás ahora)",
      settingsTitle: "Ajustes",
      settingsIntro: "Este botón te lleva a la página de usuario y ajustes",
      proceedTitle: "¿Continuar?",
      proceedIntro: "¿Listo para ir a la página de usuario y ajustes?"
    },
    user: {
      userTitle: "¡Página de usuario! 👋",
      userIntro:
        "Esta es tu página de usuario. Aquí puedes ver tu nivel, logros, amigos, configuración y más",
      profileTitle: "Perfil de usuario",
      profileIntro: "Aquí está tu perfil. ¡Salúdate! 👋",
      levelTitle: "Nivel de usuario",
      levelIntro: "Aquí se muestra tu nivel y experiencia",
      achievementsTitle: "Logros",
      achievementsIntro: "Haz clic aquí para ver tus logros",
      leaderboardTitle: "Clasificación",
      leaderboardIntro:
        "Haz clic aquí para ver la clasificación actual y estadísticas",
      settingsTitle: "Ajustes",
      settingsIntro:
        "Haz clic aquí para ver ajustes - ayuda, cerrar sesión y eliminar cuenta",
      helpTitle: "Ayuda",
      helpIntro:
        "Si quieres ver esta guía de nuevo, haz clic en el botón de ayuda",
      logoutTitle: "Cerrar sesión",
      logoutIntro: "Haz clic aquí para cerrar sesión",
      deleteTitle: "Eliminar",
      deleteIntro: "¡Este botón eliminará tu cuenta y todos tus datos!",
      endTitle: "¡Eso es todo! 👋",
      endIntro: "¿Listo para volver a la página del mapa?"
    }
  }
};
