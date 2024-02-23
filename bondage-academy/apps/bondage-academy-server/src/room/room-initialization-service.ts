import {
  BlockColor,
  BlockObject,
  Character,
  CharacterShape,
  CharacterSkin,
  HeadPose,
  ItemCode,
  LowerBodyPose,
  NPCCode,
  NPCObject,
  ObjectType,
  RoomBackgroundElementImage,
  RoomCode,
  UpperBodyPose,
} from "@bondage-academy/bondage-academy-model";
import { inject, singleton } from "tsyringe";
import { ObjectCreationService } from "../object/object-creation-service";
import { ObjectIdProvider } from "../object/object-id-provider";
import { gardenData } from "./data/garden";
import { RoomCreationService } from "./room-creation-service";
import { RoomService } from "./room-service";

@singleton()
export class RoomInitializationService {
  constructor(
    @inject(RoomService)
    private roomService: RoomService,
    @inject(RoomCreationService)
    private roomCreationService: RoomCreationService,
    @inject(ObjectIdProvider)
    private objectIdProvider: ObjectIdProvider,
    @inject(ObjectCreationService)
    private objectCreationService: ObjectCreationService,
  ) {}

  async initializeRooms(): Promise<void> {
    await this.initializeTurotialRoom();
    await this.initializePrisonCellRoom();
    await this.initializeGarden();
  }

  private async initializeTurotialRoom(): Promise<void> {
    const room = await this.roomService.getRoomByCode(RoomCode.Introduction);
    if (room != null) {
      return;
    }

    await this.roomCreationService.createTemplateRoom({
      code: RoomCode.Introduction,
      name: "rooms.intrdocution",
      width: 10,
      height: 10,
      templateSettings: {
        singleplayer: true,
      },
      transitAreas: [{ x: 2, y: 1, width: 1, height: 1 }],
      backgroundElements: [
        {
          x: 0,
          y: 0,
          width: 10,
          height: 10,
          image: RoomBackgroundElementImage.Grass,
        },
      ],
      objects: [
        await this.createBlock(0, 0),
        await this.createBlock(1, 0),
        await this.createDoor(2, 0),
        await this.createBlock(3, 0),
        await this.createBlock(4, 0),
        await this.createBlock(5, 0),
        await this.createBlock(6, 0),
        await this.createBlock(7, 0),
        await this.createBlock(8, 0),
        await this.createBlock(9, 0),
        await this.createBlock(9, 1),
        await this.createBlock(9, 2),
        await this.createBlock(9, 3),
        await this.createBlock(9, 4),
        await this.createBlock(9, 5),
        await this.createBlock(9, 6),
        await this.createBlock(9, 7),
        await this.createBlock(9, 8),
        await this.createBlock(9, 9),
        await this.createBlock(8, 9),
        await this.createBlock(7, 9),
        await this.createBlock(6, 9),
        await this.createBlock(5, 9),
        await this.createBlock(4, 9),
        await this.createBlock(3, 9),
        await this.createBlock(2, 9),
        await this.createBlock(1, 9),
        await this.createBlock(0, 9),
        await this.createBlock(0, 8),
        await this.createBlock(0, 7),
        await this.createBlock(0, 6),
        await this.createBlock(0, 5),
        await this.createBlock(0, 4),
        await this.createBlock(0, 3),
        await this.createBlock(0, 2),
        await this.createBlock(0, 1),
        await this.createNPC(8, 8, NPCCode.Headmistress, {
          shape: CharacterShape.Shape1,
          skin: CharacterSkin.Skin1,
          wearables: {},
          pose: {
            upperBody: UpperBodyPose.Crossed,
            lowerBody: LowerBodyPose.Stand,
            head: HeadPose.Normal,
          },
        }),
      ],
    });
  }

  private async initializePrisonCellRoom(): Promise<void> {
    const room = await this.roomService.getRoomByCode(RoomCode.PrisonCell);
    if (room != null) {
      return;
    }

    await this.roomCreationService.createTemplateRoom({
      code: RoomCode.PrisonCell,
      name: "rooms.prisonCell",
      width: 6,
      height: 5,
      templateSettings: {},
      transitAreas: [
        { x: 5, y: 2, width: 1, height: 1 },
        { x: 4, y: 2, width: 1, height: 1 },
      ],
      backgroundElements: [
        {
          x: 0,
          y: 0,
          width: 6,
          height: 5,
          image: RoomBackgroundElementImage.Grass,
        },
      ],
      objects: [
        await this.createBlock(0, 0),
        await this.createBlock(1, 0),
        await this.createBlock(2, 0),
        await this.createBlock(3, 0),
        await this.createBlock(4, 0),
        await this.createBlock(5, 0),
        await this.createBlock(5, 1),
        await this.createDoor(5, 2),
        await this.createBlock(5, 3),
        await this.createBlock(5, 4),
        await this.createBlock(4, 4),
        await this.createBlock(3, 4),
        await this.createBlock(2, 4),
        await this.createBlock(1, 4),
        await this.createBlock(0, 4),
        await this.createBlock(0, 3),
        await this.createBlock(0, 2),
        await this.createBlock(0, 1),
        await this.createNPC(1, 1, NPCCode.PrisonGuard, {
          shape: CharacterShape.Shape1,
          skin: CharacterSkin.Skin1,
          wearables: {
            LeftSleeve: { item: { code: ItemCode.XFashionSleeve } },
            RightSleeve: { item: { code: ItemCode.XFashionSleeve } },
            LowerUndies: { item: { code: ItemCode.XFashionThong } },
          },
          pose: {
            upperBody: UpperBodyPose.Attention,
            lowerBody: LowerBodyPose.Stand,
            head: HeadPose.Normal,
          },
        }),
      ],
    });
  }

  private async initializeGarden(): Promise<void> {
    const room = await this.roomService.getRoomByCode(RoomCode.Garden);
    if (room != null) {
      return;
    }

    await this.roomCreationService.createTemplateRoom({
      code: RoomCode.Garden,
      name: "rooms.garden",
      width: 30,
      height: 30,
      templateSettings: {},
      transitAreas: [
        {
          x: 0,
          y: 13,
          width: 1,
          height: 1,
        },
        {
          x: 0,
          y: 12,
          width: 1,
          height: 1,
        },
        {
          x: 0,
          y: 14,
          width: 1,
          height: 1,
        },
        {
          x: 1,
          y: 12,
          width: 2,
          height: 3,
        },
      ],
      backgroundElements: [
        {
          x: 0,
          y: 0,
          width: 30,
          height: 30,
          image: RoomBackgroundElementImage.Grass,
        },
        {
          x: 0,
          y: 12,
          width: 30,
          height: 3,
          image: RoomBackgroundElementImage.Road,
        },
        {
          x: 18,
          y: 0,
          width: 3,
          height: 30,
          image: RoomBackgroundElementImage.Road,
        },
        {
          x: 12,
          y: 6,
          width: 15,
          height: 15,
          image: RoomBackgroundElementImage.Road,
        },
        {
          x: 15,
          y: 9,
          width: 9,
          height: 9,
          image: RoomBackgroundElementImage.Grass,
        },
      ],
      objects: await Promise.all(
        gardenData.objects.map(async (object) => ({
          ...object,
          id: await this.objectIdProvider.getNextId(),
        })),
      ),
    });
  }

  private async createBlock(x: number, y: number): Promise<BlockObject> {
    return {
      id: await this.objectIdProvider.getNextId(),
      type: ObjectType.Block,
      position: { x, y },
      color: BlockColor.Red,
    };
  }

  private async createDoor(x: number, y: number): Promise<BlockObject> {
    return {
      id: await this.objectIdProvider.getNextId(),
      type: ObjectType.Block,
      position: { x, y },
      color: BlockColor.Green,
    };
  }

  private async createNPC(
    x: number,
    y: number,
    code: NPCCode,
    character: Character,
  ): Promise<NPCObject> {
    return await this.objectCreationService.createNPC({
      position: {
        x,
        y,
      },
      code,
      character,
    });
  }
}
