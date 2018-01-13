// Turn off some lights
function change_lights()
{
	for (digit_num = 0; digit_num < global_digit_list.length; digit_num++)
	{
		var digit = global_digit_list[digit_num];
		var digit_transform = transform_to_digit(digit_num);

		for (segment_num = 0; segment_num < digit.segments.length; segment_num++)
		{
			var segment = digit.segments[segment_num];
			if (segment.desired)
			{
				var transforms = transform_to_segment(segment.name, digit_transform);

				for (transform_num = 0; transform_num < transforms.length; transform_num++)
				{
					var transform = transforms[transform_num];
					var name = "#circle_" + transform.x + "_" + transform.y;
					$(name).attr('fill', 'black');
				}
			}
		}
	}
}

