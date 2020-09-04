function jarak_bom(start, destination, board, columns, rows)
{
    start = new node(start[0], start[1], -1, -1, -1, -1);
	destination = new node(destination[0], destination[1], -1, -1, -1, -1);

	var open = []; //List of open nodes (nodes to be inspected)
	var closed = []; //List of closed nodes (nodes we've already inspected)

	var g = 0; //Cost from start to current node
	var h = heuristic(start, destination); //Cost from current node to destination
	var f = g+h; //Cost from start to destination going through the current node	
	
}


function heuristic(current_node, destination)
{
	//Find the straight-line distance between the current node and the destination. (Thanks to id for the improvement)
	//return Math.floor(Math.sqrt(Math.pow(current_node.x-destination.x, 2)+Math.pow(current_node.y-destination.y, 2)));
	var x = current_node.x-destination.x;
	var y = current_node.y-destination.y;
	return x+y;
}

	


