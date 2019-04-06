/*
 * Author: Handa
 */

import NassauScene from '/iwgame/js/nassau.js';
import House1Scene from '/iwgame/js/house1.js';
import House2Scene from '/iwgame/js/house2.js';
import House3Scene from '/iwgame/js/house3.js';
import FirestoneScene from '/iwgame/js/firestone.js';
import ChancellorGreenScene from '/iwgame/js/chancellorgreen.js';
import DormScene from '/iwgame/js/dorm.js';
import McCoshScene from '/iwgame/js/mccosh.js';

// keep track of the spawnpoint in the main this.Map
let spawnPoint;

class MainScene extends Phaser.Scene {
  constructor ()
  {
    super({key: 'Main', active: true});
    Phaser.Scene.call(this, 'MainScene');
  }

  SwitchToNassau(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("NassauScene");
  }

  SwitchToFirestone(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("FirestoneScene");
  }

  SwitchToChancellorGreen(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("ChancellorGreenScene");
  }

  SwitchToDorm(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("DormScene");
  }

  SwitchToMcCosh(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("McCoshScene");
  }

  SwitchToHouse1(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("House1Scene");
  }

  SwitchToHouse2(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("House2Scene");
  }

  SwitchToHouse3(p, nd) {
    spawnPoint.x = p.x;
    spawnPoint.y = p.y + 10;
    p.scene.input.stopPropagation();
    p.scene.scene.start("House3Scene");
  }

  preload()
  {
    // Load the tiles
    this.load.image("basics_tiles", "/iwgame/assets/basics.png");
    this.load.image("statics_tiles", "/iwgame/assets/statics.png");
    this.load.image("classic_tiles", "/iwgame/assets/ClassicRPG_Sheet.png");

    this.load.tilemapTiledJSON("map", "/iwgame/assets/princeton_map.json");

    // Load the player sprite
    this.load.spritesheet('student', '/iwgame/assets/student.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create()
  {
    // Make the map
    this.Map = this.make.tilemap({ key: "map" });

    // Tilesets
    const tileset1 = this.Map.addTilesetImage("basics", "basics_tiles");
    const tileset2 = this.Map.addTilesetImage("statics", "statics_tiles");
    const tileset3 = this.Map.addTilesetImage("ClassicRPG_Sheet", "classic_tiles");
    const tilesets = [tileset1, tileset2, tileset3];

    // Layers
    this.GroundLayer = this.Map.createStaticLayer("Ground Layer", tilesets, 0, 0);
    this.MidLayer = this.Map.createStaticLayer("Mid Layer", tilesets, 0, 0);
    this.TopLayer = this.Map.createStaticLayer("Top Layer", tilesets, 0, 0);
    this.TopTopLayer = this.Map.createStaticLayer("Top Top Layer", tilesets, 0, 0);

    this.MidLayer.setCollisionByProperty({ collide: true });

    this.TopLayer.setDepth(10);
    this.TopTopLayer.setDepth(20);

    // Set spawn point
    if (spawnPoint == null) {
      spawnPoint = this.Map.findObject("Objects", obj => obj.name === "Spawn Point");
    }

    // create the this.Player
    this.Player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'student').setSize(6,8).setOffset(5,8);

    // add collision with the coolision set objects from the mid layer
    this.physics.add.collider(this.Player, this.MidLayer);

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
    camera.startFollow(this.Player);
    camera.setBounds(0, 0, this.Map.widthInPixels, this.Map.heightInPixels);

    // Set bounds of the world
    this.physics.world.setBounds(0, 0, this.Map.widthInPixels, this.Map.heightInPixels);

    // Collide with the boundaries of the world
    this.Player.setCollideWorldBounds(true);

    // Create the cursors
    this.Cursors = this.input.keyboard.createCursorKeys();

    this.LocationText = this.add
    .text(16, 16, "Princeton", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 }
    })
    .setScrollFactor(0)
    .setDepth(30);

    // get the objects from the main map for labeling locations
    const p = this.Map.findObject("Objects", obj => obj.name === "Prospect Garden");
    const pG = this.add.zone(p.x, p.y).setSize(p.width, p.height);
    this.physics.world.enable(pG, 1);
    this.physics.add.overlap(this.Player, pG, () => this.LocationText.setText("Prospect Garden"));

    const c = this.Map.findObject("Objects", obj => obj.name === "Cannon Green");
    const cG = this.add.zone(c.x, c.y).setSize(c.width, c.height);
    this.physics.world.enable(cG, 1);
    this.physics.add.overlap(this.Player, cG,  () => this.LocationText.setText("Cannon Green"));

    const b = this.Map.findObject("Objects", obj => obj.name === "Blair Arch");
    const bG = this.add.zone(b.x, b.y).setSize(b.width, b.height);
    this.physics.world.enable(bG, 1);
    this.physics.add.overlap(this.Player, bG, () => this.LocationText.setText("Blair Arch"));

    const s = this.Map.findObject("Objects", obj => obj.name === "The Slums");
    const sG = this.add.zone(s.x, s.y).setSize(s.width, s.height);
    this.physics.world.enable(sG, 1);
    this.physics.add.overlap(this.Player, sG, () => this.LocationText.setText("The Slums"));

    // add all boundaries to return to princeton
    const pton = this.Map.filterObjects("Objects", obj => obj.name === "pton");
    let i;
    for (i = 0; i < pton.length; i++) {
      const ptonG = this.add.zone(pton[i].x, pton[i].y).setSize(pton[i].width, pton[i].height);
      this.physics.world.enable(ptonG, 1);
      this.physics.add.overlap(this.Player, ptonG, () => this.LocationText.setText("Princeton"));
    }

    // entering Nassau
    const nassauG = this.Map.createFromObjects("Objects","Nassau Door", {key: "Nassau Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(nassauG, 1);
    this.physics.add.overlap(this.Player, nassauG, this.SwitchToNassau);

    const firestoneG = this.Map.createFromObjects("Objects","Firestone Door", {key: "Firestone Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(firestoneG, 1);
    this.physics.add.overlap(this.Player, firestoneG, this.SwitchToFirestone);

    const chancellorG = this.Map.createFromObjects("Objects","East Pyne Door", {key: "East Pyne Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(chancellorG, 1);
    this.physics.add.overlap(this.Player, chancellorG, this.SwitchToChancellorGreen);

    const dormG = this.Map.createFromObjects("Objects","Dorm Door", {key: "Dorm Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(dormG, 1);
    this.physics.add.overlap(this.Player, dormG, this.SwitchToDorm);

    const mccoshG = this.Map.createFromObjects("Objects","McCosh Door", {key: "McCosh Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(mccoshG, 1);
    this.physics.add.overlap(this.Player, mccoshG, this.SwitchToMcCosh);

    // entering House 1
    const house1G = this.Map.createFromObjects("Objects","House One Door", {key: "House One Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(house1G, 1);
    this.physics.add.overlap(this.Player, house1G, this.SwitchToHouse1);

    // entering House 2
    const house2G = this.Map.createFromObjects("Objects","House Two Door", {key: "House Two Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(house2G, 1);
    this.physics.add.overlap(this.Player, house2G, this.SwitchToHouse2);

    // entering House 3
    const house3G = this.Map.createFromObjects("Objects","House Four Door", {key: "House Four Door", alpha: 0})[0].setSize(30, 30);
    this.physics.world.enable(house3G, 1);
    this.physics.add.overlap(this.Player, house3G, this.SwitchToHouse3);
  }

  update() 
  {
    const speed = 100;
    const prevVelocity = this.Player.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.Player.body.setVelocity(0);

    // Horizontal movement
    if (this.Cursors.left.isDown) {
      this.Player.body.setVelocityX(-speed);
    } else if (this.Cursors.right.isDown) {
      this.Player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.Cursors.up.isDown) {
      this.Player.body.setVelocityY(-speed);
    } else if (this.Cursors.down.isDown) {
      this.Player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.Player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.Cursors.left.isDown) {
      this.Player.anims.play("walk-left", true);
    } else if (this.Cursors.right.isDown) {
      this.Player.anims.play("walk-right", true);
    } else if (this.Cursors.up.isDown) {
      this.Player.anims.play("walk-up", true);
    } else if (this.Cursors.down.isDown) {
      this.Player.anims.play("walk-down", true);
    } else {
      this.Player.anims.stop();

      // If we were moving, pick an idle frame to use
      if (prevVelocity.x < 0) this.Player.setTexture("student", 5);
      else if (prevVelocity.x > 0) this.Player.setTexture("student", 9);
      else if (prevVelocity.y < 0) this.Player.setTexture("student", 13);
      else if (prevVelocity.y > 0) this.Player.setTexture("student", 1);
    }
  }
}

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
  scene: [ MainScene, NassauScene, House1Scene, House2Scene, House3Scene, FirestoneScene, ChancellorGreenScene, DormScene, McCoshScene ]
};

const game = new Phaser.Game(config);
