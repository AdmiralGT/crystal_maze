// Used on page load to generate the light grid and buttons that will be in game
var interval
var blocks = []
var keyIDs = []

var svg_width = 1200
var svg_height = 675

var MIN_KEY = 65 // a
var MAX_KEY = 90 // z
var SPACE_BAR = 32

class Block 
{
	constructor(id, target, key) {
		this.block_id = id
		this.x = getRandomInt(100, 1000)
		this.length = 80
		this.speed = Math.random() + 1
		this.target_object = target
		this.key = key
		this.active = true
		this.updateRight()
		this.sizeBlock()
	}

	sizeBlock()
	{

		sizeObject(this.block_id, this.length)
	}

	stopBlock(keyID)
	{
		if (keyID == this.key)
		{
			this.active = false
			if (this.inTarget())
			{
				this.target_object.colourTarget()
			}
		}
	}

	updateRight()
	{
		this.right = this.x + this.length
	}

	moveBlock()
	{
		if (this.active)
		{
			this.x = this.x + this.speed
			this.updateRight()
			this.placeBlock()
			this.flipBlock()
		}
	}

	flipBlock()
	{
		if ((this.right > 1160) || (this.x < 40))
		{
			this.speed = this.speed * -1
		}
	}

	placeBlock()
	{
		placeObject(this.block_id, this.x)
	}

	inTarget()
	{
		if ((this.x > this.target_object.left) && ((this.x + this.length) < this.target_object.right))
		{
			return true
		}
		return false
	}

	reset()
	{
		this.active = true
		this.target_object.resetTarget()
	}
}

class Target
{
	constructor(colour)
	{
		this.target_id = colour + "_target"
		this.length = getRandomInt(120, 160)
		this.x = getRandomInt(100, 1100 - this.length)
		this.left = this.x + 2
		this.right = this.x + this.length - 4
		this.colour = colour
		this.sizeTarget()
		this.placeTarget()
	}

	placeTarget()
	{
		placeObject(this.target_id, this.x)
	}

	sizeTarget()
	{
		sizeObject(this.target_id, this.length)
	}

	colourTarget()
	{
		colourObject(this.target_id, this.colour)
	}

	resetTarget()
	{
		colourObject(this.target_id, "white")
	}

}

function placeObject(id, x)
{
	var object = document.getElementById(id)
	object.setAttribute("x", x.toString())
}

function sizeObject(id, width)
{
	var object = document.getElementById(id)
	object.setAttribute("width", width.toString())
}

function colourObject(id, colour)
{
	var object = document.getElementById(id)
	object.style.fill = colour
}

function generate_game()
{
    size_game_board("svg_area", svg_width, svg_height)
    initializeGame()

    interval = setInterval(loop, 2)

}

// Function responsible for the main game loop
function loop()
{
	blocks.forEach(block => block.moveBlock())
}

function initializeGame()
{
	for (var ii = MIN_KEY; ii <= MAX_KEY; ii++)
	{
		keyIDs.push(ii)
	}
	shuffle(keyIDs)
	initializeBlocks()
	initializeTargets()
}

function initializeBlocks()
{
	var blue = new Target("blue")
	var red = new Target("red")
	var gold = new Target("gold")
	var limegreen = new Target("limegreen")
	var cyan = new Target("cyan")
	var darkorange = new Target("darkorange")
	//var purple = new Target("purple")
	//var hotpink = new Target("hotpink")

	// x, y, length, target, key
	blocks.push(new Block("blue", blue, keyIDs.pop()))
	blocks.push(new Block("red", red, keyIDs.pop()))
	blocks.push(new Block("gold", gold, keyIDs.pop()))
	blocks.push(new Block("limegreen", limegreen, keyIDs.pop()))
	blocks.push(new Block("cyan", cyan, keyIDs.pop()))
	blocks.push(new Block("darkorange", darkorange, keyIDs.pop()))
	//blocks.push(new Block("purple", 1024, 2, 80, purple, keyIDs.pop()))
	//blocks.push(new Block("hotpink", 134, 2, 80, hotpink, keyIDs.pop()))
}

function initializeTargets()
{
	return
}

function check_result()
{
	for (var ii = 0; ii < blocks.length; ii++)
	{
		block = blocks[ii]
		// If any block is active, we can't be winning
		if (block.active)
		{
			return
		}

		// If the block isn't in the target, then we can't win
		if (!block.inTarget())
		{
			return
		}
	}
	alert("The crystal is yours!")
}

function stopBlocks(keyID)
{
	blocks.forEach(block => block.stopBlock(keyID))
	check_result()
}

function resetBlocks()
{
	blocks.forEach(block => block.reset())
}

function isValidKeyCode(keyID)
{
	if (keyID == SPACE_BAR)
	{
		// Space bar
		return true
	}
	if ((keyID < MIN_KEY) || (keyID > MAX_KEY))
	{
		// a - z
		return false
	}
	// 0 is key 48, 9 is 57, there are no keycodes between 9 (57) and a (65)
	//if ((keyID > 57) && (keyID < 65))
	//{
	//	return false
	//}
	return true
}

$(document).keydown(function (e) {
	// Prevent the default behaviour so we don't lose focus
	keyID = e.which

	if (isValidKeyCode(keyID))
	{
		e.preventDefault();
		if (keyID == SPACE_BAR)
		{
			resetBlocks()
		}
		else
		{
			stopBlocks(keyID)
		}
	}
});
