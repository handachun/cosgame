/*
 * Author: Handa
 */

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  pixelArt: true,
  parent: "game-container",
  zoom: 2,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;

// main map
let mainMap;

// layers for the main map
let groundLayer;
let midLayer;
let topLayer;
let topTopLayer;

// keep track of the spawnpoint in the main map
let spawnPoint;

// location text
let locationText;

// location objects
let pG;
let cG;
let bG;
let sG;
let ptonG;

function preload()
{
  // Load the tiles
  this.load.image("basics_tiles", "assets/basics.png");
  this.load.image("statics_tiles", "assets/statics.png");
  this.load.image("classic_tiles", "assets/ClassicRPG_Sheet.png");

  this.load.tilemapTiledJSON("map", "assets/princeton_map.json");

  // Load the player sprite
  this.load.spritesheet('student', 'assets/student.png', {
    frameWidth: 16,
    frameHeight: 16
  });
}

function handlePG() {
  locationText.setText("Prospect Garden");
}

function handleCG() {
  locationText.setText("Cannon Green");
}

function handleBG() {
  locationText.setText("Blair Arch");
}

function handleSG() {
  locationText.setText("The Slums");
}

function handlePtonG() {
  locationText.setText("Princeton");
}

function create()
{
  // Make the map
  mainMap = this.make.tilemap({ key: "map" });
  const map = mainMap;

  // Tilesets
  const tileset1 = map.addTilesetImage("basics", "basics_tiles");
  const tileset2 = map.addTilesetImage("statics", "statics_tiles");
  const tileset3 = map.addTilesetImage("ClassicRPG_Sheet", "classic_tiles");
  const tilesets = [tileset1, tileset2, tileset3];

  // Layers
  groundLayer = map.createStaticLayer("Ground Layer", tilesets, 0, 0);
  midLayer = map.createStaticLayer("Mid Layer", tilesets, 0, 0);
  topLayer = map.createStaticLayer("Top Layer", tilesets, 0, 0);
  topTopLayer = map.createStaticLayer("Top Top Layer", tilesets, 0, 0);

  midLayer.setCollisionByProperty({ collide: true });

  topLayer.setDepth(10);
  topTopLayer.setDepth(20);

  // Set spawn point
  spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

  // create the player
  player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'student').setSize(6,8).setOffset(5,8);

  // add collision with the coolision set objects from the mid layer
  this.physics.add.collider(player, midLayer);

  // create var for anims to make calling easier
  const anims = this.anims;

  /*
   * START animations defs HERE
   */
  anims.create({
    key: "walk-down",
    frames: this.anims.generateFrameNumbers('student', {
      start: 0,
      end: 3,
      first: 0
    }),
    frameRate: 7,
    repeat: -1
  });
  anims.create({
    key: "walk-left",
    frames: this.anims.generateFrameNumbers('student', {
      start: 4,
      end: 7,
      first: 0
    }),
    frameRate: 7,
    repeat: -1
  });
  anims.create({
    key: "walk-right",
    frames: this.anims.generateFrameNumbers('student', {
      start: 8,
      end: 11,
      first: 0
    }),
    frameRate: 7,
    repeat: -1
  });
  anims.create({
    key: "walk-up",
    frames: this.anims.generateFrameNumbers('student', {
      start: 12,
      end: 15,
      first: 0
    }),
    frameRate: 7,
    repeat: -1
  });

  /*
   * END animations anims HERE
   */

  // Make camera follow the player and set boundaries 
  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // Set bounds of the world
  this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // Collide with the boundaries of the world
  player.setCollideWorldBounds(true);

  // Create the cursors
  cursors = this.input.keyboard.createCursorKeys();

  locationText = this.add
  .text(16, 16, "Princeton", {
    font: "18px monospace",
    fill: "#000000",
    padding: { x: 5, y: 5 }
  })
  .setScrollFactor(0)
  .setDepth(30);

  // get the objects from the main map for labeling locations
  const p = map.findObject("Objects", obj => obj.name === "Prospect Garden");
  pG = this.add.zone(p.x, p.y).setSize(p.width, p.height);
  this.physics.world.enable(pG, 1);
  this.physics.add.overlap(player, pG, handlePG);

  const c = map.findObject("Objects", obj => obj.name === "Cannon Green");
  cG = this.add.zone(c.x, c.y).setSize(c.width, c.height);
  this.physics.world.enable(cG, 1);
  this.physics.add.overlap(player, cG, handleCG);

  const b = map.findObject("Objects", obj => obj.name === "Blair Arch");
  bG = this.add.zone(b.x, b.y).setSize(b.width, b.height);
  this.physics.world.enable(bG, 1);
  this.physics.add.overlap(player, bG, handleBG);

  const s = map.findObject("Objects", obj => obj.name === "The Slums");
  sG = this.add.zone(s.x, s.y).setSize(s.width, s.height);
  this.physics.world.enable(sG, 1);
  this.physics.add.overlap(player, sG, handleSG);

  // add all boundaries to return to princeton
  const pton = map.filterObjects("Objects", obj => obj.name === "pton");
  let i;
  for (i = 0; i < pton.length; i++) {
    ptonG = this.add.zone(pton[i].x, pton[i].y).setSize(pton[i].width, pton[i].height);
    this.physics.world.enable(ptonG, 1);
    this.physics.add.overlap(player, ptonG, handlePtonG);
  }
}

function update() 
{
  const speed = 100;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("walk-left", true);
  } else if (cursors.right.isDown) {
    player.anims.play("walk-right", true);
  } else if (cursors.up.isDown) {
    player.anims.play("walk-up", true);
  } else if (cursors.down.isDown) {
    player.anims.play("walk-down", true);
  } else {
    player.anims.stop();

    // If we were moving, pick an idle frame to use
    if (prevVelocity.x < 0) player.setTexture("student", 5);
    else if (prevVelocity.x > 0) player.setTexture("student", 9);
    else if (prevVelocity.y < 0) player.setTexture("student", 13);
    else if (prevVelocity.y > 0) player.setTexture("student", 1);
}
}
