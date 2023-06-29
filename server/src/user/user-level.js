class Level {
  constructor(xp) {
    this.xp = xp;
  }

  get lvl() {
    return Math.floor(Math.sqrt(this.xp));
  }

  get lvlXp() {
    return this.xp - Math.pow(this.lvl, 2);
  }

  get reqLvlXp() {
    return Math.pow(this.lvl + 1, 2) - Math.pow(this.lvl, 2);
  }
}

module.exports = Level;
