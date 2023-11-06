(function () {
  var ROOT_PATH = "C:\\Users\\Xenon\\Projects\\BondageAcademy\\render\\";
  var NODE_LIST_NAME = "Default";
  var AVATAR_WIDTH = 420;
  var AVATAR_HEIGHT = 550;
  var SCENE_WIDTH = 550;
  var SCENE_HEIGHT = 550;
  var WIDTH = 600;
  var HEIGHT = 800;

  var CHARACTERS = ["Kiri"];

  var SPECIAL_POSES = ["Pet suit"];

  var HEAD_POSES = ["Normal", "Wide open"];

  var UPPER_BODY_POSES = ["Attention", "Crossed"];

  var LOWER_BODY_POSES = ["Stand", "Simple kneel", "Wide kneel"];

  var BODY_PARTS = ["Head", "Body", "Upper body", "Lower body"];

  var WEARABLES = [
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
          hideBodyParts: ["Left Foot", "Right foot", "Left Hand", "Right Hand"],
        },
      ],
    },
  ];

  renderAllCharacters();

  function renderAllCharacters() {
    for (var i = 0; i < CHARACTERS.length; i++) {
      renderCharacter(CHARACTERS[i]);
    }
  }

  function renderCharacter(character) {
    for (var i = 0; i < SPECIAL_POSES.length; i++) {
      renderSpecialPoses(character, SPECIAL_POSES[i]);
    }
  }

  function renderSpecialPoses(character, pose) {
    loadScene("scenes/Character.duf");
    loadRenderSettings();

    // Create body
    openFile("characters\\" + character + ".duf");
    var body = findNodeByLabel(character);
    selectSingleNodeByLabel(character);
    openFile("poses\\special\\" + pose + ".duf");
    hideChild(body, "Head");
    hideChild(body, "Eyelashes");
    hideChild(body, "Tear");
    hideChild(body, "Eyes");
    hideChild(body, "Mouth");
    hideChild(body, "Eyebrows");

    // render(
    //   "output\\" + character + " - Special pose - " + pose + " - Body.png",
    //   WIDTH,
    //   HEIGHT
    // );

    enableRenderingToCanvases();

    var wearablesWithConditions = getWearablesWithConditionsToRender(
      "Body",
      pose
    );
    for (var i = 0; i < wearablesWithConditions.length; i++) {
      var wearable = wearablesWithConditions[i].wearable;
      var condition = wearablesWithConditions[i].condition;
      selectSingleNode(body);
      for (var j = 0; j < wearable.fragments.length; j++) {
        var fragment = wearable.fragments[j];
        openFile(fragment.path);
      }
      for (var j = 0; j < (condition.hideBodyParts || []).length; j++) {
        hideChild(body, condition.hideBodyParts[j]);
      }
      for (var j = 0; j < wearable.fragments.length; j++) {
        var fragment = wearable.fragments[j];
        clearNodesToRender();
        for (var k = 0; k < fragment.nodes.length; k++) {
          addNodeToRender(findChild(body, fragment.nodes[k]));
        }
        // render(
        //   "output\\" +
        //     character +
        //     " - Special pose - " +
        //     pose +
        //     " - Body - " +
        //     fragment.name +
        //     ".png",
        //   WIDTH,
        //   HEIGHT
        // );
      }
      // for (var j = 0; j < (wearable.hideBodyParts || []).length; j++) {
      //   showChild(body, wearable.hideBodyParts[j]);
      // }
      // for (var j = 0; j < wearable.fragments.length; j++) {
      //   var fragment = wearable.fragments[j];
      //   for (var k = 0; k < fragment.nodes.length; k++) {
      //     removeNode(findChild(body, fragment.nodes[k]));
      //   }
      // }
    }

    // Create head
    // openFile("characters\\" + character + ".duf");
    // var head = findNodeByLabel(character + " (2)");
    // selectSingleNodeByLabel(character + " (2)");
    // openFile("poses\\special\\" + pose + ".duf");
    // openFile("poses\\head\\Normal.duf");
    // hideChild(head, "Hip");
    // showChild(head, "Head");
    // hideChild(head, "Vagina");

    // clearNodesToRender();
    // addHeadToRender(head);

    // render(
    //   "output\\" +
    //     character +
    //     " - Special pose - " +
    //     pose +
    //     " - Head - Normal.png",
    //   WIDTH,
    //   HEIGHT
    // );
  }

  function getWearablesWithConditionsToRender(bodyPart, pose) {
    var wearablesWithConditions = [];
    for (var i = 0; i < WEARABLES.length; i++) {
      var wearable = WEARABLES[i];
      var condition = undefined;
      for (var j = 0; j < wearable.conditions.length; j++) {
        if (
          wearable.conditions[j].bodyPart === bodyPart &&
          wearable.conditions[j].poses.indexOf(pose) > -1
        ) {
          condition = wearable.conditions[j];
          break;
        }
      }
      if (condition) {
        wearablesWithConditions.push({
          wearable: wearable,
          condition: condition,
        });
      }
    }

    return wearablesWithConditions;
  }

  function loadRenderSettings() {
    openFile("settings\\Render settings.duf");
  }

  function render(filename, width, height) {
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

  function addHeadToRender(head) {
    addNodeToRender(head);
    addNodeToRender(findChild(head, "Eyelashes"));
    addNodeToRender(findChild(head, "Tear"));
    addNodeToRender(findChild(head, "Eyes"));
    addNodeToRender(findChild(head, "Mouth"));
    addNodeToRender(findChild(head, "Eyebrows"));
  }

  function hideChild(parent, childLabel) {
    var child = findChild(parent, childLabel);
    hideNode(child);
  }

  function showChild(parent, childLabel) {
    var child = findChild(parent, childLabel);
    showNode(child);
  }

  function findChild(parent, childLabel) {
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
    return null;
  }

  function hideNode(node) {
    setNodeVisibility(node, false);
  }

  function showNode(node) {
    setNodeVisibility(node, true);
  }

  function setNodeVisibility(node, visible) {
    node.setVisible(visible);
    node.getNodeChildren(true).forEach(function (child) {
      child.setVisible(visible);
    });
  }

  function addNodeToRender(node) {
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

  function selectSingleNode(node) {
    deselectAllNodes();
    node.select();
  }

  function openFile(path) {
    // @ts-ignore
    App.getContentMgr().openFile(ROOT_PATH + path);
  }

  function selectSingleNodeByLabel(label) {
    deselectAllNodes();
    findNodeByLabel(label).select();
  }

  function findNodeByLabel(label) {
    // @ts-ignore
    return Scene.findNodeByLabel(label);
  }

  function deselectAllNodes() {
    // @ts-ignore
    Scene.selectAllNodes(false);
  }

  function removeNode(node) {
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

  function loadScene(path) {
    // @ts-ignore
    Scene.loadScene(ROOT_PATH + path, DzScene.OpenNew);
  }

  // ******************************************************************

  // function renderScenes(scenes) {
  //   for (var i = 0; i < scenes.length; i++) {
  //     var scene = scenes[i];
  //     renderScene(scene);
  //   }
  // }

  // function renderScene(scene) {
  //   if (scene.type === "AVATAR_SUBMISSIVE") {
  //     renderSubmissiveAvatar(scene);
  //   } else if (scene.type === "AVATAR_DOMINANT") {
  //     renderDominantAvatar(scene);
  //   } else if (scene.type === "BDSM") {
  //     renderBDSMScene(scene);
  //   } else if (scene.type === "STANDARD") {
  //     renderStandardScene(scene);
  //   }
  // }

  // function renderSubmissiveAvatar(scene) {
  //   var actorLabel = scene.actor.split("_")[0];
  //   loadScene(
  //     "scenes\\Avatar\\Submissive\\" +
  //       scene.device +
  //       "\\" +
  //       scene.device +
  //       ".duf"
  //   );
  //   loadRenderSettings();

  //   // Load body
  //   openFile("actors\\" + actorLabel + ".duf");
  //   selectSingleNodeByLabel(actorLabel);
  //   openFile(getSceneAssetsPath(scene) + scene.actor + "_pose.duf");

  //   // Load head
  //   openFile("actors\\" + actorLabel + ".duf");
  //   selectSingleNodeByLabel(actorLabel + " (2)");
  //   openFile(getSceneAssetsPath(scene) + scene.actor + "_pose.duf");

  //   // Show body, hide head
  //   var body = findNodeByLabel(actorLabel);
  //   showBody(body);
  //   var head = findNodeByLabel(actorLabel + " (2)");
  //   hideNode(head);

  //   // Render device and body
  //   render(
  //     getSceneOutputPath(scene) + scene.actor + ".png",
  //     AVATAR_WIDTH,
  //     AVATAR_HEIGHT
  //   );

  //   enableRenderingToCanvases();

  //   // Show head
  //   showHead(head);

  //   // Render head
  //   clearNodesToRender();
  //   addHeadToRender(head);

  //   renderHeadExpressions(scene, scene.actor, head, [
  //     "Aroused",
  //     "Edge",
  //     "Pleasure",
  //     "Smile",
  //     "Tired",
  //     "Default",
  //     "Afraid",
  //     "Angry",
  //     "Humiliated",
  //     "Pain",
  //     "Tickled",
  //   ]);

  //   openFile("poses\\Head_Reset.duf");

  //   // Render wearables
  //   for (var i = 0; i < scene.wearables.length; i++) {
  //     var wearableName = scene.wearables[i];
  //     var wearable = WEARABLES[wearableName];
  //     var parent = wearable.place === "HEAD" ? head : body;

  //     deselectAllNodes();
  //     parent.select();
  //     openWearable(wearable, wearableName);

  //     clearNodesToRender();
  //     for (var j = 0; j < wearable.nodesToRender.length; j++) {
  //       addNodeToRender(findChild(parent, wearable.nodesToRender[j]));
  //     }

  //     render(
  //       getSceneOutputPath(scene) + scene.actor + "_" + wearableName + ".png",
  //       AVATAR_WIDTH,
  //       AVATAR_HEIGHT
  //     );

  //     for (var j = 0; j < wearable.parentNodes.length; j++) {
  //       removeNode(findChild(parent, wearable.parentNodes[j]));
  //     }

  //     if (
  //       wearable.place === "HEAD" &&
  //       wearable.poses &&
  //       wearable.poses.length > 0
  //     ) {
  //       openFile("poses\\Head_Reset.duf");
  //     }
  //   }
  // }

  // function renderDominantAvatar(scene) {
  //   var actorLabel = scene.actor.split("_")[0];
  //   loadScene(getSceneAssetsPath(scene) + scene.actor + ".duf");
  //   loadRenderSettings();
  //   enableRenderingToCanvases();

  //   // Load body
  //   openFile("actors\\" + actorLabel + ".duf");
  //   selectSingleNodeByLabel(actorLabel);
  //   openFile(getSceneAssetsPath(scene) + scene.actor + "_pose.duf");
  //   var body = findNodeByLabel(actorLabel);

  //   // Render body
  //   clearNodesToRender();
  //   addNodeToRender(body);
  //   addNodeToRender(findChild(body, "Genitalia"));
  //   addNodeToRender(findChild(body, "Hair"));
  //   addNodeToRender(findChild(body, "Eyelashes"));

  //   render(
  //     getSceneOutputPath(scene) + scene.actor + ".png",
  //     AVATAR_WIDTH,
  //     AVATAR_HEIGHT
  //   );

  //   // Render wearables
  //   for (var i = 0; i < scene.wearables.length; i++) {
  //     var wearableName = scene.wearables[i];
  //     var wearable = WEARABLES[wearableName];

  //     deselectAllNodes();
  //     body.select();
  //     openWearable(wearable, wearableName);

  //     clearNodesToRender();
  //     for (var j = 0; j < wearable.nodesToRender.length; j++) {
  //       addNodeToRender(findChild(body, wearable.nodesToRender[j]));
  //     }

  //     render(
  //       getSceneOutputPath(scene) + scene.actor + "_" + wearableName + ".png",
  //       AVATAR_WIDTH,
  //       AVATAR_HEIGHT
  //     );

  //     for (var j = 0; j < wearable.parentNodes.length; j++) {
  //       removeNode(findChild(body, wearable.parentNodes[j]));
  //     }
  //   }
  // }

  // function renderBDSMScene(scene) {
  //   var submissive = scene.submissive.name;
  //   var dominant = scene.dominant.name;
  //   loadScene(
  //     getSceneAssetsPath(scene) +
  //       scene.device +
  //       "_" +
  //       submissive +
  //       "_" +
  //       dominant +
  //       "_" +
  //       scene.name +
  //       ".duf"
  //   );
  //   loadRenderSettings();
  //   enableRenderingToCanvases();

  //   // Load submissive body
  //   openFile("actors\\" + submissive + ".duf");
  //   selectSingleNodeByLabel(submissive);
  //   openFile(getSceneAssetsPath(scene) + submissive + "_pose.duf");

  //   // Load submissive head
  //   openFile("actors\\" + submissive + ".duf");
  //   selectSingleNodeByLabel(submissive + " (2)");
  //   openFile(getSceneAssetsPath(scene) + submissive + "_pose.duf");

  //   // Load dominant body and head
  //   openFile("actors\\" + dominant + ".duf");
  //   selectSingleNodeByLabel(dominant);
  //   openFile(getSceneAssetsPath(scene) + dominant + "_pose.duf");

  //   // Hide submissive head
  //   var submissiveBody = findNodeByLabel(submissive);
  //   showBody(submissiveBody);
  //   var submissiveHead = findNodeByLabel(submissive + " (2)");
  //   hideNode(submissiveHead);

  //   // Render everything except submissive head
  //   clearNodesToRender();
  //   if (scene.nodesToRender) {
  //     for (var i = 0; i < scene.nodesToRender.length; i++) {
  //       addNodeToRender(findNodeByLabel(scene.nodesToRender[i]));
  //     }
  //   }
  //   addNodeToRender(submissiveBody);
  //   addNodeToRender(findChild(submissiveBody, "Genitalia"));
  //   var dominantActor = findNodeByLabel(dominant);
  //   addNodeToRender(dominantActor);
  //   addNodeToRender(findChild(dominantActor, "Genitalia"));
  //   addNodeToRender(findChild(dominantActor, "Hair"));
  //   addNodeToRender(findChild(dominantActor, "Eyelashes"));

  //   render(
  //     getSceneOutputPath(scene) +
  //       scene.device +
  //       "_" +
  //       submissive +
  //       "_" +
  //       dominant +
  //       "_" +
  //       scene.name +
  //       ".png",
  //     SCENE_WIDTH,
  //     SCENE_HEIGHT
  //   );

  //   // Show submissive head
  //   showHead(submissiveHead);

  //   // Render submissive head
  //   clearNodesToRender();
  //   addHeadToRender(submissiveHead);

  //   renderHeadExpressions(
  //     scene,
  //     submissive,
  //     submissiveHead,
  //     scene.submissive.expressions
  //   );

  //   openFile("poses\\Head_Reset.duf");

  //   // Render submissive wearables
  //   for (var i = 0; i < scene.submissive.wearables.length; i++) {
  //     var wearableName = scene.submissive.wearables[i];
  //     var wearable = WEARABLES[wearableName];
  //     var parent = wearable.place === "HEAD" ? submissiveHead : submissiveBody;

  //     deselectAllNodes();
  //     parent.select();
  //     openWearable(wearable, wearableName);

  //     clearNodesToRender();
  //     for (var j = 0; j < wearable.nodesToRender.length; j++) {
  //       addNodeToRender(findChild(parent, wearable.nodesToRender[j]));
  //     }

  //     render(
  //       getSceneOutputPath(scene) + submissive + "_" + wearableName + ".png",
  //       SCENE_WIDTH,
  //       SCENE_HEIGHT
  //     );

  //     for (var j = 0; j < wearable.parentNodes.length; j++) {
  //       removeNode(findChild(parent, wearable.parentNodes[j]));
  //     }

  //     if (
  //       wearable.place === "HEAD" &&
  //       wearable.poses &&
  //       wearable.poses.length > 0
  //     ) {
  //       openFile("poses\\Head_Reset.duf");
  //     }
  //   }

  //   // Render dominant wearables
  //   for (var i = 0; i < scene.dominant.wearables.length; i++) {
  //     var wearableName = scene.dominant.wearables[i];
  //     var wearable = WEARABLES[wearableName];

  //     deselectAllNodes();
  //     dominantActor.select();
  //     openWearable(wearable, wearableName);

  //     clearNodesToRender();
  //     for (var j = 0; j < wearable.nodesToRender.length; j++) {
  //       addNodeToRender(findChild(dominantActor, wearable.nodesToRender[j]));
  //     }

  //     render(
  //       getSceneOutputPath(scene) + dominant + "_" + wearableName + ".png",
  //       SCENE_WIDTH,
  //       SCENE_HEIGHT
  //     );

  //     for (var j = 0; j < wearable.parentNodes.length; j++) {
  //       removeNode(findChild(dominantActor, wearable.parentNodes[j]));
  //     }
  //   }
  // }

  // function renderStandardScene(scene) {
  //   loadScene(getSceneAssetsPath(scene) + scene.name + ".duf");
  //   loadRenderSettings();
  //   if (scene.simpleRender) {
  //     render(
  //       getSceneOutputPath(scene) + scene.name + ".png",
  //       SCENE_WIDTH,
  //       SCENE_HEIGHT
  //     );
  //     return;
  //   }

  //   enableRenderingToCanvases();

  //   // Load actors
  //   for (var i = 0; i < (scene.actors || []).length; i++) {
  //     var actor = scene.actors[i];
  //     openFile("actors\\" + actor.name + ".duf");
  //     selectSingleNodeByLabel(actor.name);
  //     openFile(getSceneAssetsPath(scene) + actor.name + "_pose.duf");
  //   }

  //   // Render everything
  //   clearNodesToRender();
  //   for (var i = 0; i < (scene.nodesToRender || []).length; i++) {
  //     addNodeToRender(findNodeByLabel(scene.nodesToRender[i]));
  //   }
  //   for (var i = 0; i < (scene.actors || []).length; i++) {
  //     var actorNode = findNodeByLabel(scene.actors[i].name);
  //     addNodeToRender(actorNode);
  //     addNodeToRender(findChild(actorNode, "Genitalia"));
  //     addNodeToRender(findChild(actorNode, "Hair"));
  //     addNodeToRender(findChild(actorNode, "Eyelashes"));
  //   }

  //   render(
  //     getSceneOutputPath(scene) + scene.name + ".png",
  //     SCENE_WIDTH,
  //     SCENE_HEIGHT
  //   );

  //   // Render actors wearables
  //   for (var i = 0; i < (scene.actors || []).length; i++) {
  //     var actor = scene.actors[i];
  //     for (var j = 0; j < (actor.wearables || []).length; j++) {
  //       var wearableName = actor.wearables[j];
  //       var wearable = WEARABLES[wearableName];
  //       var actorNode = findNodeByLabel(actor.name);

  //       selectSingleNode(actorNode);
  //       openWearable(wearable, wearableName);

  //       clearNodesToRender();
  //       for (var k = 0; k < (wearable.nodesToRender || []).length; k++) {
  //         addNodeToRender(findChild(actorNode, wearable.nodesToRender[k]));
  //       }

  //       render(
  //         getSceneOutputPath(scene) + actor.name + "_" + wearableName + ".png",
  //         SCENE_WIDTH,
  //         SCENE_HEIGHT
  //       );

  //       for (var k = 0; k < (wearable.parentNodes || []).length; k++) {
  //         removeNode(findChild(actorNode, wearable.parentNodes[k]));
  //       }
  //     }
  //   }

  //   // Render fragments
  //   for (var i = 0; i < (scene.fragments || []).length; i++) {
  //     var fragment = scene.fragments[i];
  //     clearNodesToRender();
  //     for (var j = 0; j < (fragment.nodes || []).length; j++) {
  //       var node = findNodeByLabel(fragment.nodes[j]);
  //       showNode(node);
  //       addNodeToRender(node);
  //     }
  //     render(
  //       getSceneOutputPath(scene) + fragment.name + ".png",
  //       SCENE_WIDTH,
  //       SCENE_HEIGHT
  //     );
  //     for (var j = 0; j < (fragment.nodes || []).length; j++) {
  //       var node = findNodeByLabel(fragment.nodes[j]);
  //       hideNode(node);
  //     }
  //   }
  // }

  // function openWearable(wearable, wearableName) {
  //   if (wearable.poses && wearable.poses.length > 0) {
  //     for (var j = 0; j < wearable.poses.length; j++) {
  //       openFile("poses\\" + wearable.poses[j] + ".duf");
  //     }
  //   }
  //   openFile(
  //     "wearables\\" +
  //       getWearableDirectory(wearable) +
  //       "\\" +
  //       wearableName.replace(/([a-z])([A-Z])/g, "$1 $2") +
  //       ".duf"
  //   );
  // }

  // function getWearableDirectory(wearable) {
  //   if (wearable.type === "Gag") {
  //     return "gags";
  //   } else if (wearable.type === "Outfit") {
  //     return "outfits";
  //   } else if (wearable.type === "Shoes") {
  //     return "shoes";
  //   } else if (wearable.type === "Accessory") {
  //     return "accessories";
  //   }
  // }

  // function renderHeadExpressions(scene, actor, head, expressions) {
  //   var renderSquint = false;
  //   for (var i = 0; i < expressions.length; i++) {
  //     renderHead(scene, actor, head, expressions[i]);
  //     if (
  //       ["Aroused", "Edge", "Pleasure", "Smile", "Tired"].indexOf(
  //         expressions[i]
  //       ) > -1
  //     ) {
  //       renderSquint = true;
  //     } else {
  //       renderHead(scene, actor, head, expressions[i], "Gag_001");
  //       renderHead(scene, actor, head, expressions[i], "Gag_002");
  //     }
  //   }
  //   if (renderSquint) {
  //     renderHead(scene, actor, head, "Squint", "Gag_001");
  //     renderHead(scene, actor, head, "Squint", "Gag_002");
  //   }
  // }

  // function renderHead(scene, actor, head, expressionPose, gagPose) {
  //   selectSingleNode(head);
  //   openFile("poses\\Head_Reset.duf");
  //   if (expressionPose === "Squint") {
  //     openFile("poses\\expressions\\Pleasure.duf");
  //   } else if (expressionPose !== "Default") {
  //     openFile("poses\\expressions\\" + expressionPose + ".duf");
  //   }
  //   if (gagPose) {
  //     openFile("poses\\" + gagPose + ".duf");
  //   }

  //   render(
  //     getSceneOutputPath(scene) +
  //       actor +
  //       "_Head_" +
  //       expressionPose +
  //       (gagPose ? "_" + gagPose : "") +
  //       ".png",
  //     getRenderWidth(scene),
  //     getRenderHeight(scene)
  //   );
  // }

  // function getRenderWidth(scene) {
  //   if (
  //     scene.type === "AVATAR_SUBMISSIVE" ||
  //     scene.type === "AVATAR_DOMINANT"
  //   ) {
  //     return AVATAR_WIDTH;
  //   } else {
  //     return SCENE_WIDTH;
  //   }
  // }

  // function getRenderHeight(scene) {
  //   if (
  //     scene.type === "AVATAR_SUBMISSIVE" ||
  //     scene.type === "AVATAR_DOMINANT"
  //   ) {
  //     return AVATAR_HEIGHT;
  //   } else {
  //     return SCENE_HEIGHT;
  //   }
  // }

  // function getSceneOutputPath(scene) {
  //   if (scene.type === "AVATAR_SUBMISSIVE") {
  //     return (
  //       "outputs\\Avatar\\Submissive\\" +
  //       scene.device +
  //       "\\" +
  //       scene.actor +
  //       "\\"
  //     );
  //   } else if (scene.type === "AVATAR_DOMINANT") {
  //     return "outputs\\Avatar\\Dominant\\" + scene.actor + "\\";
  //   } else if (scene.type === "BDSM") {
  //     return (
  //       "outputs\\BDSM\\" +
  //       scene.device +
  //       "_" +
  //       scene.submissive.name +
  //       "_" +
  //       scene.dominant.name +
  //       "_" +
  //       scene.name +
  //       "\\"
  //     );
  //   } else if (scene.type === "STANDARD") {
  //     return "outputs\\Standard\\" + scene.location + "\\" + scene.name + "\\";
  //   }
  // }

  // // @ts-ignore
  // function getSceneAssetsPath(scene) {
  //   if (scene.type === "AVATAR_SUBMISSIVE") {
  //     return (
  //       "scenes\\Avatar\\Submissive\\" +
  //       scene.device +
  //       "\\" +
  //       scene.actor +
  //       "\\"
  //     );
  //   } else if (scene.type === "AVATAR_DOMINANT") {
  //     return "scenes\\Avatar\\Dominant\\" + scene.actor + "\\";
  //   } else if (scene.type === "BDSM") {
  //     return (
  //       "scenes\\BDSM\\" +
  //       scene.device +
  //       "_" +
  //       scene.submissive.name +
  //       "_" +
  //       scene.dominant.name +
  //       "_" +
  //       scene.name +
  //       "\\"
  //     );
  //   } else if (scene.type === "STANDARD") {
  //     return "scenes\\Standard\\" + scene.location + "\\" + scene.name + "\\";
  //   }
  // }

  // function showBody(body) {
  //   showNode(body);
  //   hideChild(body, "Eyelashes");
  //   hideChild(body, "Hair");
  //   hideChild(body, "Head");
  // }

  // function showHead(head) {
  //   showNode(head);
  //   hideChild(head, "Genitalia");
  //   hideChild(head, "Hip");
  //   showChild(head, "Head");
  // }
})();
