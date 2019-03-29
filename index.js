let fp = require('lodash')
const fs = require('fs')
const assert = require('assert')
const utils = require('./utils.js')
const nukeCity = utils.nukeCity
const killMonster = utils.killMonster
// use npm index.js <n monsters> optional args = <path/to/map/file>
const args = process.argv.slice(2);
if (args.length < 1){
	console.log('supply <n monsters> as cli-arg')
	return
}
const n = fp.head(args)
const worldFile = fp.nth(args,1) || 'world_data/world_map_medium.txt'

// Lets assume the file is small enough to fit into memory as a string
// lets also assume UTF-8 encoding
const contents = fs.readFileSync(worldFile,'UTF-8')
const splitted = fp.filter(contents.split('\n'), line => { return line !== '' })



// Adjacency list
const makeRoutes = line => {
	const routesRaw = fp.tail(line.split(' '))
	return fp.reduce(routesRaw, (result, value, key) => {
		(result[fp.nth(value.split('='),1)] || (result[fp.nth(value.split('='),1)] =fp.head(value.split('='))))
		return result;
	},{})
}

// build the map
const makeMap = lines => {
	return fp.reduce(lines, (result, value, key) => {
		(result[fp.head(value.split(' '))] || (result[fp.head(value.split(' '))] = makeRoutes(value)))
		return result;
	},{})
}
let world = makeMap(splitted)

// set up the monsters they may start in the same city
let monsterKeys = fp.range(n)
monsters = {}
fp.forEach(monsterKeys, key => monsters[key]={location:fp.sample(fp.keys(world)),name:key},monsters)

// steps through one turn, returns the new game state
const gameTurn = (gameState) => {
	let world = gameState.world
	let monsters = gameState.monsters
	let deadMonsters = []
	let deadCities = []

	// lets see if we are in the same city as another monster
	fp.forEach(monsters, monster => {
		const otherMonsters = fp.filter(monsters, otherMonster => { return otherMonster.name!==monster.name })
		fp.forEach(otherMonsters, otherMonster => {
			if (otherMonster.location === monster.location) {

					// dont add the destroyed city to deadCities twice
				if (!fp.includes(deadCities,monster.location)){
					console.log(`${monster.location} has been destroyed by monster ${otherMonster.name} and monster ${monster.name}!`)
					deadMonsters.push(monster.name)
					deadMonsters.push(otherMonster.name)
					deadCities.push(monster.location)
				}
			}
		})
	}, world,monsters)

	//update the state

	// first see if any extra monsters got wiped out in a titanic multi monster battle
	fp.forEach(monsters, candidate => {
		if (fp.includes(deadCities, candidate.location)){
			console.log(`Monster ${candidate.name}, died in the fall of ${candidate.location}!`)
			deadMonsters.push(candidate.name)
		}
	})
	// get rid of any dead monsters`
		fp.forEach(deadMonsters, deadMonster => {
			monsters = killMonster(monsters, deadMonster)
		})

	// dead cities
		fp.forEach(deadCities, deadCity => {
		world = nukeCity(world, deadCity)
	})
	//move the monsters
	fp.forEach(monsters, monster => monster.location = fp.sample(fp.keys(world[monster.location])) || monster.location)
	return {world:world,monsters:monsters}
}

//start the game
let turnNumber = 0
let gameState = {world:world, monsters:monsters}
while (turnNumber < 10000 && fp.keys(gameState.monsters).length > 0){
	gameState=gameTurn(gameState)
	turnNumber += 1
}
world = gameState.world
//output
console.log('\n:::: final state ::::\n')
let cities = fp.keys(world)
fp.forEach(cities, city => {
	let s = `${city}`
	const routes = fp.keys(world[city])
	fp.forEach(routes, route =>{
	s+=` ${world[city][route]} ${route}`},s)

	console.log(s)
})
