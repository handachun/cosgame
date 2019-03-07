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

function preload()
{
  // Load the player sprite
  this.load.spritesheet('student', 'assets/pton_sprite_16.png', {
    frameWidth: 16,
    frameHeight: 16
  });
}

function create()
{
  player = this.physics.add.sprite(200, 150, 'student');

  // create var for anims to make calling easier
  const anims = this.anims;

  /*
   * START animations HERE
   */
  anims.create({
    key: "test",
    frames: this.anims.generateFrameNumbers('student', {
      start: 0,
      end: 15,
      first: 0
    }),
    frameRate: 7,
    repeat: -1
  });

  /*
   * END animations HERE
   */
  player.anims.play("test");
}

function update() 
{

}
