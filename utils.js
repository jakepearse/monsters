fp = require('lodash')
// wipe out a monster
const killMonster = (monsters, deadMonster) => {
	delete monsters[deadMonster]
	return monsters
}


// remove all incoming routes and target city
const nukeCity = (map, deadCity) => {
	fp.forEach(fp.keys(map), city => {
			delete map[city][deadCity]
	},map)
	delete map[deadCity]
	return map
}

module.exports = {nukeCity:nukeCity,killMonster:killMonster}
