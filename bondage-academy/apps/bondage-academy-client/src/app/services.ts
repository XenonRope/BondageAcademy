import { configureServiceContainer } from "./services-def";

export const {
  t,
  socketService,
  store,
  storeService,
  roomService,
  minigameService,
  wardrobeService,
  sideMenuService,
  npcCharacterService,
  translator,
  dialogueOptionService,
  accountService,
  navigationService,
  chatService,
  characterLayerService,
  characterPoseService,
  characterPoseValidator,
  actionService,
  itemCustomizationAccessChecker,
} = configureServiceContainer();
