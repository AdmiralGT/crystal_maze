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
		this.target_id = target
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
		if ((this.x > 600) || (this.x < 1))
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
		if ((this.x > this.target.left) && (this.x < this.target.right))
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

function sizeObject(id, width)
{
	var object = document.getElementById(id)
	object.setAttribute("width", width.toString())
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
	// x, y, length, speed, target, key
	blocks.push(new Block("blue", 5, 2, 80, 2, null, 58))
	blocks.push(new Block("red", 5, 2, 80, 2, null, 49))
	blocks.push(new Block("yellow", 5, 2, 80, 2, null, 52))
	blocks.push(new Block("limegreen", 5, 2, 80, 2, null, 74))
	blocks.push(new Block("cyan", 5, 2, 80, 2, null, 84))
	blocks.push(new Block("darkorange", 5, 2, 80, 2, null, 60))
	blocks.push(new Block("purple", 5, 2, 80, 2, null, 87))
	blocks.push(new Block("hotpink", 5, 2, 80, 2, null, 80))
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
