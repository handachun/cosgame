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

function create()
{
  // Make the map
  const map = this.make.tilemap({ key: "map" });

  // Tilesets
  const tileset1 = map.addTilesetImage("basics", "basics_tiles");
  const tileset2 = map.addTilesetImage("statics", "statics_tiles");
  const tileset3 = map.addTilesetImage("ClassicRPG_Sheet", "classic_tiles");
  const tilesets = [tileset1, tileset2, tileset3];

  // Layers
  const groundLayer = map.createStaticLayer("Ground Layer", tilesets, 0, 0);
  const midLayer = map.createStaticLayer("Mid Layer", tilesets, 0, 0);
  const topLayer = map.createStaticLayer("Top Layer", tilesets, 0, 0);
  const topTopLayer = map.createStaticLayer("Top Top Layer", tilesets, 0, 0);

  midLayer.setCollisionByProperty({ collide: true });

  topLayer.setDepth(10);
  topTopLayer.setDepth(20);

  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

  player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'student').setSize(6,8).setOffset(5,8);

  // create var for anims to make calling easier
  const anims = this.anims;

  this.physics.add.collider(player, midLayer);

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

  // Create the cursors
  cursors = this.input.keyboard.createCursorKeys();

  player.anims.play("walk-right", true);
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
