const characters = ["Kiri"] as const;
type Character = (typeof characters)[number];

const fullBodyPoses = ["Pet suit"] as const;
type FullBodyPose = (typeof fullBodyPoses)[number];

const headPoses = ["Normal", "Wide open"] as const;
type HeadPose = (typeof headPoses)[number];

const upperBodyPoses = ["Attention", "Crossed"] as const;
type UpperBodyPose = (typeof upperBodyPoses)[number];

const lowerBodyPoses = ["Stand", "Simple kneel", "Wide kneel"] as const;
type LowerBodyPose = (typeof lowerBodyPoses)[number];

type Pose = FullBodyPose | HeadPose | UpperBodyPose | LowerBodyPose;

const bodyParts = ["Body", "Head", "Upper body", "Lower body"] as const;
type BodyPart = (typeof bodyParts)[number];

const bones = ["Left Foot", "Right Foot", "Left Hand", "Right Hand"] as const;
type Bone = (typeof bones)[number];

interface Fragment {
  name: string;
  path: string;
  nodes: string[];
}

type Condition = (
  | { bodyPart: "Body"; poses: FullBodyPose[] }
  | { bodyPart: "Head"; poses: HeadPose[] }
  | { bodyPart: "Upper body"; poses: UpperBodyPose[] }
  | { bodyPart: "Lower body"; poses: LowerBodyPose[] }
) & { hideBodyParts?: Bone[] };

interface Wearable {
  name: string;
  fragments: Fragment[];
  conditions: Condition[];
}

interface WearableWithCondition {
  wearable: Wearable;
  condition: Condition;
}

interface DzNode {
  getNodeChildren(recursive: boolean): DzNode[];

  getLabel(): string;

  setVisible(visible: boolean): void;

  select(): void;
}

var ROOT_PATH = "C:\\Users\\Xenon\\Projects\\BondageAcademy\\render\\";
var NODE_LIST_NAME = "Default";
var WIDTH = 600;
var HEIGHT = 800;

var WEARABLES: Wearable[] = [
  {
    name: "Ball gag",
    fragments: [
      {
        name: "Ball gag ball",
        path: "restraints\\gags\\Ball gag\\Ball gag - ball.duf",
        nodes: ["BallGag_Ball"],
      },
      {
        name: "Ball gag strap",
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
  {
    name: "Pet suit",
    fragments: [
      {
        name: "Pet suit",
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
];

renderAllCharacters();

function renderAllCharacters() {
  for (const character of characters) {
    renderCharacter(character);
  }
}

function renderCharacter(character: Character) {
  for (const fullBodyPose of fullBodyPoses) {
    renderFullBodyPoses(character, fullBodyPose);
  }
}

function renderFullBodyPoses(character: Character, pose: FullBodyPose) {
  loadScene("scenes/Character.duf");
  loadRenderSettings();

  // Create body
  openFile("characters\\" + character + ".duf");
  var body = findNodeByLabel(character);
  selectSingleNodeByLabel(character);
  openFile("poses\\full body\\" + pose + ".duf");
  hideChild(body, "Head");
  hideChild(body, "Eyelashes");
  hideChild(body, "Tear");
  hideChild(body, "Eyes");
  hideChild(body, "Mouth");
  hideChild(body, "Eyebrows");

  render(
    "output\\" + character + " - Full body pose - " + pose + " - Body.png",
    WIDTH,
    HEIGHT
  );

  enableRenderingToCanvases();

  var wearablesWithConditions = getWearablesWithConditionsToRender(
    "Body",
    pose
  );
  for (var i = 0; i < wearablesWithConditions.length; i++) {
    var wearable = wearablesWithConditions[i].wearable;
    var condition = wearablesWithConditions[i].condition;
    selectSingleNode(body);
    for (var fragment of wearable.fragments) {
      openFile(fragment.path);
    }
    for (var hideBodyPart of condition?.hideBodyParts ?? []) {
      hideChild(body, hideBodyPart);
    }
    for (var j = 0; j < wearable.fragments.length; j++) {
      var fragment = wearable.fragments[j];
      clearNodesToRender();
      for (var k = 0; k < fragment.nodes.length; k++) {
        addNodeToRender(findChild(body, fragment.nodes[k]));
      }
      render(
        "output\\" +
          character +
          " - Full body pose - " +
          pose +
          " - Body - " +
          fragment.name +
          ".png",
        WIDTH,
        HEIGHT
      );
    }
    for (var hideBodyPart of condition?.hideBodyParts ?? []) {
      showChild(body, hideBodyPart);
    }
    for (var fragment of wearable.fragments) {
      for (var node of fragment.nodes) {
        removeNode(findChild(body, node));
      }
    }
  }

  // Create head
  openFile("characters\\" + character + ".duf");
  var head = findNodeByLabel(character + " (2)");
  selectSingleNodeByLabel(character + " (2)");
  openFile("poses\\full body\\" + pose + ".duf");
  openFile("poses\\head\\Normal.duf");
  hideChild(head, "Hip");
  showChild(head, "Head");
  hideChild(head, "Vagina");

  clearNodesToRender();
  addHeadToRender(head);

  render(
    "output\\" +
      character +
      " - Full body pose - " +
      pose +
      " - Head - Normal.png",
    WIDTH,
    HEIGHT
  );
}

function getWearablesWithConditionsToRender(
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
