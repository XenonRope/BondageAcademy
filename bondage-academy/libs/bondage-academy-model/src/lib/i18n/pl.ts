import { RawDictionary } from "./dictionary";

export const plDictionary: RawDictionary = {
  common: {
    username: "Nazwa użytkownika",
    password: "Hasło",
    characterName: "Nazwa postaci",
    login: "Zaloguj",
    createAccount: "Utwórz konto",
    back: "Wstecz",
    exploreAcademy: "Eksploruj akademię",
    publicRooms: "Publiczne pokoje",
    createRoom: "Utwórz pokój",
    roomName: "Nazwa pokoju",
    pose: "Pozycja",
    wardrobe: "Garderoba",
    equipment: "Ekwipunek",
    chooseItem: "Wybierz przedmiot",
    removeCloth: "Zdejmij",
    customize: "Dostosuj",
    noAccess: "Brak dostępu",
  },
  rooms: {
    introduction: "Wprowadzenie",
    prisonCell: "Cela więzienna",
  },
  npc: {
    headmistress: "Dyrektorka",
  },
  dialogue: {
    welcomeInOurAcademy: "Witaj w naszej akademii!",
    whoAreYou: "Kim jestes?",
    iAmHeadmistressOfThisAcademy: "Jestem dyrektorką tej akademii!",
    iNeedClothes: "Potrzebuję ubrań.",
    kneelIfYouWantToAskMeForFavor:
      "Klęknij jeżeli chcesz mnie prosić o przysługę!",
    iHaveSomethingSuitableForYouHere: "Mam tutaj dla ciebie coś odpowiedniego.",
  },
  poses: {
    petSuit: "Pet suit",
    attention: "Attention",
    crossed: "Crossed",
    handsUp: "Hands up",
    stand: "Stand",
    standHeels: "Stand heels",
    wideLegs: "Wide legs",
    wideLegsHeels: "Wide legs heels",
    simpleKneel: "Simple kneel",
    wideKneel: "Wide kneel",
    normal: "Normal",
    wideOpen: "Wide open",
  },
  slots: {
    hair: "Włosy",
    mouth: "Usta",
    nipples: "Sutki",
    upperUndies: "Górna bielizna",
    upperOutfit: "Górne ubranie",
    leftSleeve: "Lewy rękaw",
    rightSleeve: "Prawy rękaw",
    body: "Ciało",
    lowerUndies: "Dolna bielizna",
    shoes: "Buty",
  },
  items: {
    hair1: "Włosy 1",
    ballGag: "Ball gag",
    nipplePiercingSphere: "Piercing sphere",
    nipplePiercingSpider: "Piercing spider",
    nipplePiercingCShape: "Piercing C shape",
    nipplePiercingOrnament: "Piercing ornament",
    nipplePiercingMoon: "Piercing moon",
    beccaMeshBra: "Becca mesh bra",
    beyondSuitBra: "Beyond suit bra",
    beccaMeshTop: "Becca mesh top",
    xFashionSleeve: "X fashion sleeve",
    magicChristmasGlove: "Magic christmas glove",
    petSuit: "Pet suit",
    xFashionThong: "X fashion thong",
    cynthiaHighHeels: "Cynthia high heels",
  },
  fragments: {
    strap: "Strap",
    insole: "Insole",
    platform: "Platform",
    outsole: "Outsole",
    ball: "Ball",
  },
  textures: {
    default: "Domyślny",
    dots: "W kropki",
  },
  minigame: {
    common: {
      cancel: "Przerwij",
    },
    changeWardrobe: {
      youAreUsing: "Używasz",
      youAreRemoving: "Zdejmujesz",
      isUsing: "używa",
      isRemoving: "zdejmuje",
      on: "na",
      onYou: "na tobie",
      from: "z",
      fromYou: "z ciebie",
      resist: "Opieraj się",
    },
  },
  action: {
    smile: {
      smile: "Uśmiechnij się",
      smiles: ({ actor }: { actor: string }) => `${actor} uśmiecha się`,
    },
  },
  actionSidePanel: {
    action: "Akcja",
  },
  roomCreation: {
    template: "Szablon",
    name: "Nazwa",
    description: "Opis",
  },
};
