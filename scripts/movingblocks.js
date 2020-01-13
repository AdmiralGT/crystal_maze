// Used on page load to generate the light grid and buttons that will be in game
var interval
var blocks = []
var keydowns = 0

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
		var bar = document.getElementById(this.block_id)
		bar.setAttribute("x", this.x.toString())
	}
}

function generate_game()
{
    size_game_board("svg_area", 1200, 675)
    initializeBlocks()
    //initializeTargets()

    interval = setInterval(loop, 1)

}

// Function responsible for the main game loop
function loop()
{
	blocks.forEach(block => block.moveBlock())
}

function initializeBlocks()
{
	blocks.push(new Block("blue", 5, 2, 2, null, 90))
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
	//if ((keyID >= 48) || (keyID <= 90))
	//{
		e.preventDefault();
		if (e.ctrlKey)
		{
			resetBlocks()
		}
		else
		{
			stopBlocks(keyID)
		}
	//}
});
