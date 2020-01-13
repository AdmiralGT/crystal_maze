// Used on page load to generate the light grid and buttons that will be in game
var interval
var blocks = []
var keydowns = 0

var svg_width = 1200
var svg_height = 675

class Block 
{
	constructor(id, x, y, speed, target, key) {
		this.block_id = id
		this.x = x
		this.y = y
		this.speed = speed
		this.active = true
		this.key = key
		this.placeBlock()
	}

	stopBlock(keyID)
	{
		if (keyID == this.key)
		{
			this.active = false
		}
	}

	moveBlock()
	{
		if (this.active)
		{
			this.x = this.x + this.speed
			this.placeBlock()
			this.flipBlock()
		}
	}

	flipBlock()
	{
		if ((this.x > 600) || (this.x < 1))
		{
			this.speed = this.speed * -1
		}
	}

	placeBlock()
	{
		placeObject(this.block_id, this.x)
	}
}

class Target
{
	constructor(id, x, y)
	{
		this.target_id = id
		this.x = x
		this.y = y
		this.placeTarget()
	}

	placeTarget()
	{
		placeObject(this.target_id, this.x)
	}

}

function placeObject(id, x)
{
	var object = document.getElementById(id)
	object.setAttribute("x", x.toString())
}

function generate_game()
{
    size_game_board("svg_area", svg_width, svg_height)
    initializeGame()

    interval = setInterval(loop, 1)

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
	blocks.push(new Block("blue", 5, 2, 2, null, 90))
}

function initializeTargets()
{
	return
}

function stopBlocks(keyID)
{
	blocks.forEach(block => block.stopBlock(keyID))
}

function resetBlocks()
{
	blocks.forEach(block => block.active = true)
}

$(document).keydown(function (e) {
	// Prevent the default behaviour so we don't lose focus
	keyID = e.which
	if ((keyID == 32) || ((keyID >= 48) && (keyID <= 90)))
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
