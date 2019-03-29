const chai = require('chai')
const expect = chai.expect;
const utils = require('../utils.js')
describe("Monsters", function() {
  describe("killMonster", function() {
    it("removes a monster from the game", function() {
      let godzilla = {'godzilla':[]}
      let monsters = {'mothra':[],godzilla}

      expect(utils.killMonster(monsters,'mothra')).to.deep.equal({godzilla})

    });
  });

  describe("nukeCity", function() {
    it("removes all incoming routes along with a city", function() {
      const london = {'London':{
          'York':'north',
          'Canterbury':'south'
        }
      }
      const york = {'York':{
          'London':'south'
        }
      }
      const canterbury = {'Canterbury':{
          'London':'north'
        }
      }
      const map = {...london,...york,...canterbury}
      const wreckedMap = {...york,...canterbury}
      expect(utils.nukeCity(map,'London')).to.deep.equal(wreckedMap)
    });
  });
});
