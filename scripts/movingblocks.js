// Used on page load to generate the light grid and buttons that will be in game
var interval
var blocks = []
var keydowns = 0

var svg_width = 1200
var svg_height = 675

class Block 
{
	constructor(id, x, y, length, speed, target, key) {
		this.block_id = id
		this.x = x
		this.y = y
		this.length = length
		this.speed = speed
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
		if ((this.x > this.target_object.left) && (this.x < this.target_object.right))
		{
			return true
		}
		return false
	}
}

class Target
{
	constructor(id, x, y, length)
	{
		this.target_id = id
		this.x = x
		this.y = y
		this.length = length
		this.left = this.x + 2
		this.right = this.x + length - 4
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
	initializeBlocks()
	initializeTargets()
}

function initializeBlocks()
{
	// x, y, length, speed, target, key
	var blue = new Target("blue_target", 471, 2, 143)
	blocks.push(new Block("blue", 473, 2, 80, 2, blue, 76))
	var red = new Target("red_target", 426, 2, 113)
	blocks.push(new Block("red", 428, 2, 80, 1, red, 49))
	var gold = new Target("gold_target", 996, 2, 134)
	blocks.push(new Block("gold", 998, 2, 80, 3, gold, 52))
	var limegreen = new Target("limegreen_target", 843, 2, 123)
	blocks.push(new Block("limegreen", 847, 2, 80, 3, limegreen, 74))
	var cyan = new Target("cyan_target", 314, 2, 117)
	blocks.push(new Block("cyan", 316, 2, 80, 2.5, cyan, 84))
	var darkorange = new Target("darkorange_target", 189, 2, 153)
	blocks.push(new Block("darkorange", 193, 2, 80, 2.5, darkorange, 86))
	//var purple = new Target("purple_target", 1022, 2, 156)
	//blocks.push(new Block("purple", 1024, 2, 80, 3, purple, 87))
	//var hotpink = new Target("hotpink_target", 132, 2, 119)
	//blocks.push(new Block("hotpink", 134, 2, 80, 2, hotpink, 80))
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
	blocks.forEach(block => block.active = true)
}

function isValidKeyCode(keyID)
{
	if (keyID == 32)
	{
		return true
	}
	if ((keyID < 48) || (keyID > 90))
	{
		return false
	}
	if ((keyID > 57) && (keyID < 65))
	{
		return false
	}
	return true
}

$(document).keydown(function (e) {
	// Prevent the default behaviour so we don't lose focus
	keyID = e.which

	if (isValidKeyCode(keyID))
	{
		e.preventDefault();
		if (keyID == 32)
		{
			resetBlocks()
		}
		else
		{
			stopBlocks(keyID)
		}
	}
});
