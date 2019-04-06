export default class McCoshScene extends Phaser.Scene {
  constructor ()
  {
    super({key: 'McCosh'});
    Phaser.Scene.call(this, 'McCoshScene');
  }

  SwitchToMain(p, ex)
  {
    p.scene.input.stopPropagation();
    p.scene.scene.start("MainScene");
  }

  preload()
  {
    // Load the tiles
    this.load.image("indoor_tiles", "/iwgame/assets/indoor.png");
    this.load.image("decor_tiles", "/iwgame/assets/Decor0.png");
    this.load.image("wall_tiles", "/iwgame/assets/wall.png");

    this.load.tilemapTiledJSON("mccoshmap", "/iwgame/assets/mccosh.json");

  }

  create()
  {
    // Make the this.Map
    this.Map = this.make.tilemap({ key: "mccoshmap" });

    // Tilesets
    const tileset1 = this.Map.addTilesetImage("basics", "basics_tiles");
    const tileset2 = this.Map.addTilesetImage("statics", "statics_tiles");
    const tileset3 = this.Map.addTilesetImage("indoor", "indoor_tiles");
    const tileset4 = this.Map.addTilesetImage("Decor0", "decor_tiles");
    const tileset5 = this.Map.addTilesetImage("wall", "wall_tiles");
    const tilesets = [tileset1, tileset2, tileset3, tileset4, tileset5];

    // Layers
    this.GroundLayer = this.Map.createStaticLayer("Ground Layer", tilesets, 0, 0);
    this.MidLayer = this.Map.createStaticLayer("Mid Layer", tilesets, 0, 0);
    this.TopLayer = this.Map.createStaticLayer("Top Layer", tilesets, 0, 0);

    this.MidLayer.setCollisionByProperty({ collide: true });
    this.TopLayer.setCollisionByProperty({ collide: true });

    // Set spawn point
    this.SpawnPoint = this.Map.findObject("Objects", obj => obj.name === "Spawn Point");

    // create the this.Player
    this.Player = this.physics.add.sprite(this.SpawnPoint.x, this.SpawnPoint.y, 'student').setSize(6,8).setOffset(5,8);

    // add collision with the coolision set objects from the mid layer
    this.physics.add.collider(this.Player, this.MidLayer);
    this.physics.add.collider(this.Player, this.TopLayer);

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

    // Make camera follow the this.Player and set boundaries 
    const camera = this.cameras.main;
    camera.startFollow(this.Player);
    camera.setBounds(0, 0, this.Map.widthInPixels, this.Map.heightInPixels);

    // Set bounds of the world
    this.physics.world.setBounds(0, 0, this.Map.widthInPixels, this.Map.heightInPixels);

    // Collide with the boundaries of the world
    this.Player.setCollideWorldBounds(true);

    // Create the this.Cursors
    this.Cursors = this.input.keyboard.createCursorKeys();

    this.LocationText = this.add
    .text(16, 16, "McCosh", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#ffffff"
    })
    .setScrollFactor(0)
    .setDepth(30);

    const exit = this.Map.createFromObjects("Objects","Exit", {key: "Exit", alpha:0})[0].setSize(30, 5);
    exit.setPosition(exit.x, exit.y + 15);
    this.physics.world.enable(exit, 1);
    this.physics.add.overlap(this.Player, exit, this.SwitchToMain);
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

    // Normalize and scale the velocity so that this.Player can't move faster along a diagonal
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
