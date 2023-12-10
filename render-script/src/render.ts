const CHARACTERS = ["Kiri"] as const;
type Character = (typeof CHARACTERS)[number];

const FULL_BODY_POSES = ["Pet suit"] as const;
type FullBodyPose = (typeof FULL_BODY_POSES)[number];

const HEAD_POSES = ["Normal", "Wide open"] as const;
type HeadPose = (typeof HEAD_POSES)[number];

const UPPER_BODY_POSES = ["Attention", "Crossed", "Hands up"] as const;
type UpperBodyPose = (typeof UPPER_BODY_POSES)[number];

const LOWER_BODY_POSES = [
  "Stand",
  "Stand heels",
  "Wide legs",
  "Wide legs heels",
  "Simple kneel",
  "Wide kneel",
] as const;
type LowerBodyPose = (typeof LOWER_BODY_POSES)[number];

const POSES = [
  ...FULL_BODY_POSES,
  ...HEAD_POSES,
  ...UPPER_BODY_POSES,
  ...LOWER_BODY_POSES,
];
type Pose = (typeof POSES)[number];

const BODY_PARTS = ["Body", "Head", "Upper body", "Lower body"] as const;
type BodyPart = (typeof BODY_PARTS)[number];

const BONES = [
  "Hip",
  "Left Foot",
  "Right Foot",
  "Left Hand",
  "Right Hand",
] as const;
type Bone = (typeof BONES)[number];

const DEVICES_NAMES = ["Restraint Frame", "Restraint Frame Open"] as const;
type DeviceName = (typeof DEVICES_NAMES)[number];

type Section = "Hair Front" | "Hair Back";

interface Fragment {
  name?: string;
  path: string;
  nodes: string[];
}

type Condition = (
  | { bodyPart: "Body"; poses: readonly FullBodyPose[] }
  | { bodyPart: "Head"; poses: readonly HeadPose[] }
  | { bodyPart: "Upper body"; poses: readonly UpperBodyPose[] }
  | { bodyPart: "Lower body"; poses: readonly LowerBodyPose[] }
) & { hideBodyParts?: Bone[] };

interface Wearable {
  name: WearableName;
  fragments: Fragment[];
  conditions: Condition[];
  sections?: Section[];
}

interface WearableWithCondition {
  wearable: Wearable;
  condition: Condition;
}

interface DeviceFramgent {
  name: string;
  nodes: string[];
}

interface Device {
  name: DeviceName;
  path: string;
  framgemnts: DeviceFramgent[];
}

interface DzNode {
  getNodeChildren(recursive: boolean): DzNode[];

  getLabel(): string;

  setVisible(visible: boolean): void;

  select(): void;
}

const ROOT_PATH = "C:\\Users\\Xenon\\Projects\\BondageAcademy\\render\\";
const NODE_LIST_NAME = "Default";
const WIDTH = 600;
const HEIGHT = 800;

const WEARABLES_NAMES = [
  // Hair
  "Halley Hair 1 White Back",
  "Halley Hair 1 White Front",
  // "Halley Hair 2 White Back",
  // "Halley Hair 2 White Front",
  // "Halley Hair 3 White Back",
  // "Halley Hair 3 White Front",

  // Mouth
  "Ball gag",

  // Nipples
  "Nipple Piercing Sphere",
  "Nipple Piercing Spider",
  "Nipple Piercing C Shape",
  "Nipple Piercing Ornament",
  "Nipple Piercing Moon",

  // Upper undies
  "Becca Mesh Bra Black",
  "Becca Mesh Bra Dots",
  "Beyond Suit Bra",

  // Upper outfit
  "Becca Mesh Top",

  // Sleeve
  "X Fashion Sleeve Left",
  "X Fashion Sleeve Right",
  "Magic Christmas Glove Left",
  "Magic Christmas Glove Right",

  // Body accessory
  "Beyond Suit Bones",

  // Body
  "Pet suit",

  // Lower undies
  "X Fashion Thong",

  // Shoes
  "Cynthia High Heels",
] as const;
type WearableName = (typeof WEARABLES_NAMES)[number];

const WEARABLES: Wearable[] = [
  // Hair
  {
    name: "Halley Hair 1 White Back",
    fragments: [
      {
        path: "body\\hair\\Halley Hair\\Halley Hair 1 White.duf",
        nodes: ["Halley Hair Genesis 9"],
      },
    ],
    conditions: [
      {
        bodyPart: "Head",
        poses: ["Normal"],
      },
    ],
    sections: ["Hair Back"],
  },
  {
    name: "Halley Hair 1 White Front",
    fragments: [
      {
        path: "body\\hair\\Halley Hair\\Halley Hair 1 White.duf",
        nodes: ["Halley Hair Genesis 9"],
      },
    ],
    conditions: [
      {
        bodyPart: "Head",
        poses: ["Normal"],
      },
    ],
    sections: ["Hair Front"],
  },

  // Mouth
  {
    name: "Ball gag",
    fragments: [
      {
        name: "ball",
        path: "restraints\\gags\\Ball gag\\Ball gag - ball.duf",
        nodes: ["BallGag_Ball"],
      },
      {
        name: "strap",
        path: "restraints\\gags\\Ball gag\\Ball gag - strap.duf",
        nodes: ["BallGag_Strap"],
      },
    ],
    conditions: [
      {
        bodyPart: "Head",
        poses: ["Wide open"],
      },
    ],
  },

  // Nipples
  {
    name: "Nipple Piercing Sphere",
    fragments: [
      {
        path: "clothes\\piercing\\Nipple Piercing Sphere\\Nipple Piercing Sphere.duf",
        nodes: ["NPLJ 06"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: ["Attention"],
      },
    ],
  },
  {
    name: "Nipple Piercing Spider",
    fragments: [
      {
        path: "clothes\\piercing\\Nipple Piercing Spider\\Nipple Piercing Spider.duf",
        nodes: ["NPLJ 07"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: ["Attention"],
      },
    ],
  },
  {
    name: "Nipple Piercing C Shape",
    fragments: [
      {
        path: "clothes\\piercing\\Nipple Piercing C Shape\\Nipple Piercing C Shape.duf",
        nodes: ["NPLJ 08"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: ["Attention"],
      },
    ],
  },
  {
    name: "Nipple Piercing Ornament",
    fragments: [
      {
        path: "clothes\\piercing\\Nipple Piercing Ornament\\Nipple Piercing Ornament.duf",
        nodes: ["NPLJ 10"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: ["Attention"],
      },
    ],
  },
  {
    name: "Nipple Piercing Moon",
    fragments: [
      {
        path: "clothes\\piercing\\Nipple Piercing Moon\\Nipple Piercing Moon.duf",
        nodes: ["NPLJ 01"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: ["Attention"],
      },
    ],
  },

  // Upper undies
  {
    name: "Becca Mesh Bra Black",
    fragments: [
      {
        path: "clothes\\bras\\Becca Mesh Bra\\Becca Mesh Bra Black.duf",
        nodes: ["Becca Mesh Bra Genesis 9"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },
  {
    name: "Becca Mesh Bra Dots",
    fragments: [
      {
        path: "clothes\\bras\\Becca Mesh Bra\\Becca Mesh Bra Dots.duf",
        nodes: ["Becca Mesh Bra Genesis 9"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },
  {
    name: "Beyond Suit Bra",
    fragments: [
      {
        path: "clothes\\bras\\Beyond Suit Bra\\Beyond Suit Bra.duf",
        nodes: ["Beyond_SuitG9"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },

  // Upper outfit
  {
    name: "Becca Mesh Top",
    fragments: [
      {
        path: "clothes\\tops\\Becca Mesh Top\\Becca Mesh Top.duf",
        nodes: ["Becca Mesh Top G8"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },

  // Sleeve
  {
    name: "X Fashion Sleeve Left",
    fragments: [
      {
        path: "clothes\\gloves\\X Fashion Sleeve\\X Fashion Sleeve Left.duf",
        nodes: ["X Fashion Sleeve Left"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },
  {
    name: "X Fashion Sleeve Right",
    fragments: [
      {
        path: "clothes\\gloves\\X Fashion Sleeve\\X Fashion Sleeve Right.duf",
        nodes: ["X Fashion Sleeve Right"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },
  {
    name: "Magic Christmas Glove Left",
    fragments: [
      {
        path: "clothes\\gloves\\Magic Christmas Glove\\Magic Christmas Glove Left.duf",
        nodes: ["Magic Christmas Gloves"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },
  {
    name: "Magic Christmas Glove Right",
    fragments: [
      {
        path: "clothes\\gloves\\Magic Christmas Glove\\Magic Christmas Glove Right.duf",
        nodes: ["Magic Christmas Gloves"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },

  // Body accessory
  {
    name: "Beyond Suit Bones",
    fragments: [
      {
        path: "clothes\\special\\Beyond Suit Bones\\Beyond Suit Bones.duf",
        nodes: ["Beyond_SuitG9"],
      },
    ],
    conditions: [
      {
        bodyPart: "Upper body",
        poses: UPPER_BODY_POSES,
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },

  // Body
  {
    name: "Pet suit",
    fragments: [
      {
        path: "restraints\\suits\\Pet suit\\Pet suit.duf",
        nodes: [
          "Bitchsuit_left_arm",
          "Bitchsuit_right_arm",
          "Bitchsuit_left_leg",
          "Bitchsuit_right_leg",
        ],
      },
    ],
    conditions: [
      {
        bodyPart: "Body",
        poses: ["Pet suit"],
        hideBodyParts: ["Left Foot", "Right Foot", "Left Hand", "Right Hand"],
      },
    ],
  },

  // Lower undies
  {
    name: "X Fashion Thong",
    fragments: [
      {
        path: "clothes\\panties\\X Fashion Thong\\X Fashion Thong.duf",
        nodes: ["X Fashion Thong"],
      },
    ],
    conditions: [
      {
        bodyPart: "Lower body",
        poses: ["Stand", "Wide legs", "Simple kneel", "Wide kneel"],
      },
      {
        bodyPart: "Body",
        poses: FULL_BODY_POSES,
      },
    ],
  },

  // Shoes
  {
    name: "Cynthia High Heels",
    fragments: [
      {
        name: "Platform",
        path: "clothes\\shoes\\Cynthia High Heels\\Cynthia High Heels Platform.duf",
        nodes: ["Cynthia High Heels Platform"],
      },
      {
        name: "Insole",
        path: "clothes\\shoes\\Cynthia High Heels\\Cynthia High Heels Insole.duf",
        nodes: ["Cynthia High Heels Insole"],
      },
      {
        name: "Outsole",
        path: "clothes\\shoes\\Cynthia High Heels\\Cynthia High Heels Outsole.duf",
        nodes: ["Cynthia High Heels Outsole"],
      },
      {
        name: "Strap",
        path: "clothes\\shoes\\Cynthia High Heels\\Cynthia High Heels Strap.duf",
        nodes: ["Cynthia High Heels Strap"],
      },
    ],
    conditions: [
      {
        bodyPart: "Lower body",
        poses: ["Stand heels", "Wide legs heels"],
      },
    ],
  },
];

const DEVICES: Device[] = [
  {
    name: "Restraint Frame",
    path: "devices\\Restraint Frame\\Restraint Frame.duf",
    framgemnts: [
      {
        name: "Frame",
        nodes: ["Frame"],
      },
      {
        name: "Back",
        nodes: ["Back"],
      },
      {
        name: "Plank back",
        nodes: ["PlankBack"],
      },
      {
        name: "Plank front",
        nodes: ["PlankFront"],
      },
      {
        name: "Pin",
        nodes: ["Pin"],
      },
      {
        name: "Padlock",
        nodes: ["Padlock"],
      },
      {
        name: "Girder1",
        nodes: ["Girder1"],
      },
      {
        name: "Girder2",
        nodes: ["Girder2"],
      },
    ],
  },
  {
    name: "Restraint Frame Open",
    path: "devices\\Restraint Frame\\Restraint Frame Open.duf",
    framgemnts: [
      {
        name: "Plank back",
        nodes: ["PlankBack"],
      },
    ],
  },
];

interface RenderSettings {
  characters: readonly Character[];
  bodyParts: readonly BodyPart[];
  poses: readonly Pose[];
  wearables: readonly WearableName[];
  onlyWearables: boolean;
}

renderCharacters({
  characters: CHARACTERS,
  bodyParts: BODY_PARTS,
  poses: POSES,
  wearables: WEARABLES_NAMES,
  onlyWearables: false,
});

renderItemsPreview();

renderDevices();

function renderDevices() {
  renderDevice("Restraint Frame");
  renderDevice("Restraint Frame Open");
}

function renderItemsPreview() {
  renderItemPreview("clothes\\panties\\X Fashion Thong", "X Fashion Thong");
  renderItemPreview("clothes\\gloves\\X Fashion Sleeve", "X Fashion Sleeve");
  renderItemPreview(
    "clothes\\gloves\\Magic Christmas Glove",
    "Magic Christmas Glove"
  );
  renderItemPreview("clothes\\bras\\Becca Mesh Bra", "Becca Mesh Bra Black");
  renderItemPreview("clothes\\bras\\Becca Mesh Bra", "Becca Mesh Bra Dots");
}

function renderItemPreview(basePath: string, itemName: string) {
  loadScene(`${basePath}\\${itemName} - Item.duf`);
  openFile("settings\\Render settings - Item.duf");

  render(`output\\item\\${itemName}.png`, 192, 192);
}

function renderCharacters(settings: RenderSettings) {
  for (const character of CHARACTERS) {
    if (settings.characters.indexOf(character) > -1) {
      renderCharacter(character, settings);
    }
  }
}

function renderCharacter(character: Character, settings: RenderSettings) {
  if (settings.bodyParts.indexOf("Body") > -1) {
    renderFullBodyPoses(character, settings);
  }
  if (settings.bodyParts.indexOf("Upper body") > -1) {
    renderUpperBodyPoses(character, settings);
  }
  if (settings.bodyParts.indexOf("Lower body") > -1) {
    renderLowerBodyPoses(character, settings);
  }
  if (settings.bodyParts.indexOf("Head") > -1) {
    renderHeadPoses(character, settings);
  }
}

function renderFullBodyPoses(character: Character, settings: RenderSettings) {
  for (const fullBodyPose of FULL_BODY_POSES) {
    if (settings.poses.indexOf(fullBodyPose) > -1)
      renderFullBodyPose(character, fullBodyPose, settings);
  }
}

function renderFullBodyPose(
  character: Character,
  pose: FullBodyPose,
  settings: RenderSettings
) {
  loadScene("scenes/Character.duf");
  loadRenderSettings();

  // Create body
  openFile("characters\\" + character + ".duf");
  const body = findNodeByLabel(character);
  hideHead(body);
  selectSingleNodeByLabel(character);
  openFile("poses\\full body\\" + pose + ".duf");

  if (!settings.onlyWearables) {
    render(`output\\${character} - ${pose} - Body.png`, WIDTH, HEIGHT);
  }

  enableRenderingToCanvases();

  renderWearables(body, "Body", pose, `${character} - ${pose}`, settings);
}

function renderUpperBodyPoses(character: Character, settings: RenderSettings) {
  for (const upperBodyPose of UPPER_BODY_POSES) {
    if (settings.poses.indexOf(upperBodyPose) > -1) {
      renderUpperBodyPose(character, upperBodyPose, settings);
    }
  }
}

function renderUpperBodyPose(
  character: Character,
  pose: UpperBodyPose,
  settings: RenderSettings
) {
  loadScene("scenes/Character.duf");
  loadRenderSettings();

  // Create upper body
  openFile("characters\\" + character + ".duf");
  const upperBody = findNodeByLabel(character);
  hideHead(upperBody);
  hideLowerBody(upperBody);
  selectSingleNodeByLabel(character);
  openFile("poses\\upper body\\" + pose + ".duf");

  // Create lower body
  openFile("characters\\" + character + ".duf");
  const lowerBody = findNodeByLabel(character + " (2)");
  hideUpperBodyAndHead(lowerBody);

  enableRenderingToCanvases();
  addNodeToRender(upperBody);

  if (!settings.onlyWearables) {
    render(`output\\${character} - ${pose} - Upper body.png`, WIDTH, HEIGHT);
  }

  renderWearables(
    upperBody,
    "Upper body",
    pose,
    `${character} - ${pose}`,
    settings
  );
}

function renderLowerBodyPoses(character: Character, settings: RenderSettings) {
  for (const lowerBodyPose of LOWER_BODY_POSES) {
    if (settings.poses.indexOf(lowerBodyPose) > -1) {
      renderLowerBodyPose(character, lowerBodyPose, settings);
    }
  }
}

function renderLowerBodyPose(
  character: Character,
  pose: LowerBodyPose,
  settings: RenderSettings
) {
  loadScene("scenes/Character.duf");
  loadRenderSettings();

  // Create lower body
  openFile("characters\\" + character + ".duf");
  const lowerBody = findNodeByLabel(character);
  hideUpperBodyAndHead(lowerBody);
  selectSingleNodeByLabel(character);
  openFile("poses\\lower body\\" + pose + ".duf");

  // Create upper body
  openFile("characters\\" + character + ".duf");
  const upperBody = findNodeByLabel(character + " (2)");
  hideHead(upperBody);
  hideLowerBody(upperBody);

  enableRenderingToCanvases();
  addNodeToRender(lowerBody);

  if (!settings.onlyWearables) {
    render(`output\\${character} - ${pose} - Lower body.png`, WIDTH, HEIGHT);
  }

  renderWearables(
    lowerBody,
    "Lower body",
    pose,
    `${character} - ${pose}`,
    settings
  );
}

function renderHeadPoses(character: Character, settings: RenderSettings) {
  for (const headPose of HEAD_POSES) {
    if (settings.poses.indexOf(headPose) > -1) {
      renderHeadPose(character, headPose, settings);
    }
  }
}

function renderHeadPose(
  character: Character,
  pose: HeadPose,
  settings: RenderSettings
) {
  loadScene("scenes/Character.duf");
  loadRenderSettings();

  // Create head
  openFile("characters\\" + character + ".duf");
  const head = findNodeByLabel(character);
  showOnlyHead(head);
  selectSingleNodeByLabel(character);
  openFile("poses\\head\\" + pose + ".duf");

  if (!settings.onlyWearables) {
    render(`output\\${character} - ${pose} - Head.png`, WIDTH, HEIGHT);
  }

  enableRenderingToCanvases();
  renderWearables(head, "Head", pose, `${character} - ${pose}`, settings);
}

function renderWearables(
  body: DzNode,
  bodyPart: BodyPart,
  pose: Pose,
  outputImagePrefix: string,
  settings: RenderSettings
) {
  const wearablesWithConditions = getWearablesWithConditions(bodyPart, pose);
  for (const { wearable, condition } of wearablesWithConditions) {
    if (settings.wearables.indexOf(wearable.name) === -1) {
      continue;
    }
    selectSingleNode(body);
    for (const fragment of wearable.fragments) {
      openFile(fragment.path);
    }
    for (const hideBodyPart of condition?.hideBodyParts ?? []) {
      hideChild(body, hideBodyPart);
    }
    for (const section of wearable.sections ?? []) {
      openFile(`sections\\${section}.duf`);
    }
    for (const fragment of wearable.fragments) {
      clearNodesToRender();
      for (const node of fragment.nodes) {
        addNodeToRender(findChild(body, node));
      }
      const fragmentName = fragment.name ? ` ${fragment.name}` : "";
      render(
        `output\\${outputImagePrefix} - ${wearable.name}${fragmentName}.png`,
        WIDTH,
        HEIGHT
      );
    }
    if (wearable?.sections?.length) {
      removeNode(findNodeByLabel("Iray Section Plane Node"));
    }
    for (const hideBodyPart of condition?.hideBodyParts ?? []) {
      showChild(body, hideBodyPart);
    }
    for (const fragment of wearable.fragments) {
      for (const node of fragment.nodes) {
        removeNode(findChild(body, node));
      }
    }
  }
}

function renderDevice(deviceName: DeviceName) {
  const device = findDeviceByName(deviceName);
  loadScene("scenes/Character.duf");
  loadRenderSettings();

  // Create device
  openFile(device.path);

  enableRenderingToCanvases();
  for (const { name, nodes } of device.framgemnts) {
    clearNodesToRender();
    for (const node of nodes) {
      addNodeToRender(findNodeByLabel(node));
    }
    render(`output\\device\\${deviceName} - ${name}.png`, WIDTH, HEIGHT);
  }
}

function findDeviceByName(name: DeviceName): Device {
  for (const device of DEVICES) {
    if (device.name === name) {
      return device;
    }
  }
  throw "Cannot find device with name " + name;
}

function showOnlyHead(characterNode: DzNode) {
  hideChild(characterNode, "Hip");
  showChild(characterNode, "Head");
  hideChild(characterNode, "Vagina");
}

function hideHead(characterNode: DzNode) {
  hideChild(characterNode, "Head");
  hideChild(characterNode, "Eyelashes");
  hideChild(characterNode, "Tear");
  hideChild(characterNode, "Eyes");
  hideChild(characterNode, "Mouth");
  hideChild(characterNode, "Eyebrows");
}

function hideUpperBodyAndHead(characterNode: DzNode) {
  hideChild(characterNode, "Spine 1");
  hideChild(characterNode, "Eyelashes");
  hideChild(characterNode, "Tear");
  hideChild(characterNode, "Eyes");
  hideChild(characterNode, "Mouth");
  hideChild(characterNode, "Eyebrows");
}

function hideLowerBody(characterNode: DzNode) {
  hideChild(characterNode, "Pelvis");
  hideChild(characterNode, "Vagina");
}

function getWearablesWithConditions(
  bodyPart: BodyPart,
  pose: Pose
): WearableWithCondition[] {
  var wearablesWithConditions: WearableWithCondition[] = [];
  for (var wearable of WEARABLES) {
    for (var condition of wearable.conditions) {
      if (
        condition.bodyPart === bodyPart &&
        (condition.poses as Pose[]).indexOf(pose) > -1
      ) {
        wearablesWithConditions.push({
          wearable,
          condition,
        });
        break;
      }
    }
  }

  return wearablesWithConditions;
}

function loadRenderSettings() {
  openFile("settings\\Render settings.duf");
}

function render(filename: string, width: number, height: number) {
  // @ts-ignore
  var renderManager = App.getRenderMgr();
  var renderer = renderManager.getActiveRenderer();
  var renderOptions = renderManager.getRenderOptions();
  // @ts-ignore
  renderOptions.renderImgToId = DzRenderOptions.DirectToFile;
  // @ts-ignore
  var handler = new DzImageRenderHandler(
    // @ts-ignore
    new Size(width, height),
    0,
    ROOT_PATH + filename
  );
  // @ts-ignore
  var camera = MainWindow.getViewportMgr()
    .getActiveViewport()
    .get3DViewport()
    .getCamera();
  var renderResult = renderer.render(handler, camera, renderOptions);
  if (!renderResult) {
    throw "Error during rendering " + filename;
  }
  handler.deleteLater();
}

function addHeadToRender(head: DzNode) {
  addNodeToRender(head);
  addNodeToRender(findChild(head, "Eyelashes"));
  addNodeToRender(findChild(head, "Tear"));
  addNodeToRender(findChild(head, "Eyes"));
  addNodeToRender(findChild(head, "Mouth"));
  addNodeToRender(findChild(head, "Eyebrows"));
}

function hideChild(parent: DzNode, childLabel: string) {
  var child = findChild(parent, childLabel);
  hideNode(child);
}

function showChild(parent: DzNode, childLabel: string) {
  var child = findChild(parent, childLabel);
  showNode(child);
}

function findChild(parent: DzNode, childLabel: string): DzNode {
  var children = parent.getNodeChildren(true);
  for (var i = 0; i < children.length; i++) {
    if (children[i].getLabel() === childLabel) {
      return children[i];
    }
  }
  for (var i = 0; i < children.length; i++) {
    if (children[i].getLabel().startsWith(childLabel + " (")) {
      return children[i];
    }
  }
  throw "Cannot find child node with label " + childLabel;
}

function hideNode(node: DzNode) {
  setNodeVisibility(node, false);
}

function showNode(node: DzNode) {
  setNodeVisibility(node, true);
}

function setNodeVisibility(node: DzNode, visible: boolean) {
  node.setVisible(visible);
  node.getNodeChildren(true).forEach(function (child) {
    child.setVisible(visible);
  });
}

function addNodeToRender(node: DzNode) {
  var nvidiaOptions = getNvidiaIrayRenderOptions();
  nvidiaOptions.addNodeToNodeList(NODE_LIST_NAME, node);
}

function clearNodesToRender() {
  var nvidiaOptions = getNvidiaIrayRenderOptions();
  var nodes = nvidiaOptions.getNodeListNodes(NODE_LIST_NAME);
  for (var i = 0; i < nodes.length; i++) {
    nvidiaOptions.removeNodeFromNodeList(NODE_LIST_NAME, nodes[i]);
  }
}

function selectSingleNode(node: DzNode) {
  deselectAllNodes();
  node.select();
}

function openFile(path: string) {
  // @ts-ignore
  App.getContentMgr().openFile(ROOT_PATH + path);
}

function selectSingleNodeByLabel(label: string) {
  deselectAllNodes();
  findNodeByLabel(label).select();
}

function findNodeByLabel(label: string) {
  // @ts-ignore
  return Scene.findNodeByLabel(label);
}

function deselectAllNodes() {
  // @ts-ignore
  Scene.selectAllNodes(false);
}

function removeNode(node: DzNode) {
  // @ts-ignore
  Scene.removeNode(node);
}

function enableRenderingToCanvases() {
  getNvidiaIrayRenderOptions().renderToCanvases = true;
}

function getNvidiaIrayRenderOptions() {
  // @ts-ignore
  var renderElementObjects = App.getRenderMgr().getRenderElementObjects();
  for (var i = 0; i < renderElementObjects.length; i++) {
    if (renderElementObjects[i].getName() === "NVIDIA Iray Render Options") {
      return renderElementObjects[i];
    }
  }
}

function loadScene(path: string) {
  // @ts-ignore
  Scene.loadScene(ROOT_PATH + path, DzScene.OpenNew);
}

function getEnumValues<T>(enumClass: any): T[] {
  return Object.keys(enumClass).map((key) => enumClass[key]);
}
