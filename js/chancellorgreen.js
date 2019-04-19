import Grade from '/iwgame/js/grade.js';

export default class ChancellorGreenScene extends Phaser.Scene {
  constructor ()
  {
    super({key: 'ChancellorGreen'});
    Phaser.Scene.call(this, 'ChancellorGreenScene');

    this.Score = 0;
  }

  SwitchToMain()
  {
    this.input.stopPropagation();
    this.scene.start("MainScene", {score: this.Score, completed: this.Completed});
  }

  init (data)
  {
    this.Score = data.score;
    this.Completed = data.completed;
    this.QuestionOn = false;

    this.SceneId = "chancellorgreen";
  }

  HandleCleanUp(Qo)
  {
    this.Result.destroy();
    this.QuestionOn = Qo;
  }

  WrongAnswer() 
  {
    this.QuestionText.setVisible(false);
    this.A1.setVisible(false);
    this.A2.setVisible(false);
    this.A3.setVisible(false);
    this.A4.setVisible(false);
    this.QuestionText.destroy();
    this.A1.destroy();
    this.A2.destroy();
    this.A3.destroy();
    this.A4.destroy();
    this.Result = this.add
    .text(50, 200, "Sorry, Try Again (click to close)", {
      font: "16px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#AE0000",
      align:'center'
    })
    .setScrollFactor(0)
    .setDepth(50)
    .setInteractive()
    .on('pointerdown', () => this.HandleCleanUp(false));
  }

  CorrectAnswer() 
  {
    this.Score++;
    this.QuestionText.setVisible(false);
    this.A1.setVisible(false);
    this.A2.setVisible(false);
    this.A3.setVisible(false);
    this.A4.setVisible(false);
    this.QuestionText.destroy();
    this.A1.destroy();
    this.A2.destroy();
    this.A3.destroy();
    this.A4.destroy();
    this.Result = this.add
    .text(50, 200, "Good Job!! (click to close)", {
      font: "16px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#007304",
      align:'center'
    })
    .setScrollFactor(0)
    .setDepth(50)
    .setInteractive()
    .on('pointerdown', () => this.HandleCleanUp(true));

    this.ScoreText.setText("Grade: " + Grade(this.Score));

    this.Completed.push(this.SceneId);
  }

  HandleQuestion()
  {
    let newx = this.Player.x + 7;
    if ((this.Player.x - this.Opponent.x) < 0) {
      newx = this.Player.x - 7;
    }

    let newy = this.Player.y + 7;
    if ((this.Player.y - this.Opponent.y) < 0) {
      newy = this.Player.y - 7;
    }

    this.Player.setPosition(newx, newy);

    if (this.Completed.includes(this.SceneId)) {
      return;
    }

    if (this.QuestionOn === true) {
      return;
    }

    this.QuestionText = this.add
    .text(50, 25, "What Java operator or method checks whether two strings refer to the same memory address?", {
      font: "16px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#C8A090",
      align: 'left',
      wordWrap: { width: 300, useAdvancedWrap: true }
    })
    .setScrollFactor(0)
    .setDepth(40);

    this.A1 = this.add
    .text(50, 160, "== operator", {
      font: "14px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#C8A090",
      align:'center'
    })
    .setScrollFactor(0)
    .setDepth(50)
    .setInteractive()
    .on('pointerdown', () => this.CorrectAnswer());

    this.A2 = this.add
    .text(50, 190, "= operator", {
      font: "14px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#C8A090",
      align:'center'
    })
    .setScrollFactor(0)
    .setDepth(50)
    .setInteractive()
    .on('pointerdown', () => this.WrongAnswer());

    this.A3 = this.add
    .text(50, 220, ". operator", {
      font: "14px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#C8A090",
      align:'center'
    })
    .setScrollFactor(0)
    .setDepth(50)
    .setInteractive()
    .on('pointerdown', () => this.WrongAnswer());

    this.A4 = this.add
    .text(50, 250, "equals() method", {
      font: "14px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#C8A090",
      align:'center'
    })
    .setScrollFactor(0)
    .setDepth(50)
    .setInteractive()
    .on('pointerdown', () => this.WrongAnswer());
  }

  preload()
  {
    // Load the tiles
    this.load.image("indoor_tiles", "/iwgame/assets/indoor.png");
    this.load.image("decor_tiles", "/iwgame/assets/Decor0.png");
    this.load.image("wall_tiles", "/iwgame/assets/wall.png");

    this.load.tilemapTiledJSON("chancellorgreenmap", "/iwgame/assets/chancellorgreen.json");

    this.load.image("fish", "/iwgame/assets/fish.png");
  }

  create()
  {
    // Make the this.Map
    this.Map = this.make.tilemap({ key: "chancellorgreenmap" });

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

    this.OpponentPoint = this.Map.findObject("Objects", obj => obj.name === "Opponent");
    this.Opponent = this.physics.add.sprite(this.OpponentPoint.x, this.OpponentPoint.y, 'fish').setSize(16, 16).setOffset(0,0).setImmovable(true);
    
    this.physics.add.overlap(this.Player, this.Opponent, () => this.HandleQuestion(), null, this);
    this.physics.add.collider(this.Player, this.Opponent, () => this.HandleQuestion(), () => this.QuestionOn = true );

    this.ScoreText = this.add
    .text(250, 16, "Grade: " + Grade(this.Score), {
      font: "10px monospace",
      fill: "#000000",
      padding: { x: 5, y: 5 },
      backgroundColor: "#ffffff"
    })
    .setScrollFactor(0)
    .setDepth(30);

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
    .text(16, 16, "East Pyne", {
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
    this.physics.add.overlap(this.Player, exit, () => this.SwitchToMain());
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
