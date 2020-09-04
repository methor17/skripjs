
function HPA_star(start, destination, board, columns, rows)
{
	
	start = new node(start[0], start[1], -1, -1, -1, -1);
	destination = new node(destination[0], destination[1], -1, -1, -1, -1);

	var open = []; 
	var closed = []; 

	var g = 0; 
	var h = heuristic(start, destination); 
	var f = g+h; 

	
	open.push(start); 
	
	
	
	void abstractMaze(void) { E = ;;
    C[1] = buildClusters(1);
    for (each c1; c2; c3; c4 \in C[1]) { if (adjacent(c1; c2; c3; c4))
    E = E [ buildEntrances(c1; c2);
    }
	}
	
    void buildGraph(void) { for (each e \in E) { 
	c1 = getCluster1(e; 1);
    c2 = getCluster2(e; 1);
	c3 = getCluster3(e; 1);
	c4 = getCluster4(e; 1);
    n1 = newNode(e; c1);
    n2 = newNode(e; c2);
    addNode(n1; 1);
    addNode(n2; 1);
    addEdge(n1; n2; 1; 1; INTER);
	} for (
      each c \in C[1])
	  { for ( each n1; n2 \in N[c]; n1 != n2)
		  { d = searchForDistance(n1; n2; c);
          if (d < 1)
          addEdge(n1; n2; 1; d; INTRA);
		  }
		  }
		  }
    
	void addLevelToGraph(int l) { C[l] = buildClusters(l);
    for (each c1; c2 \in C[l]) { if (adjacent(c1; c2) == false)
    continue;
    for (each e \in getEntrances(c1; c2)) { setLevel(getNode1(e); l);
    setLevel(getNode2(e); l);
    setLevel(getEdge(e); l);
	}
	} for ( each c \in C[l])
    for (each n1; n2 \in N[c]; n1 != n2) { d = searchForDistance(n1; n2; c);
    if (d < 1)
    addEdge(n1; n2; l; d; INTRA)
	}
	}
 

    void preprocessing(int maxLevel) { abstractMaze();
    buildGraph();
    for (l = 2; l =< maxLevel; l + +)
    addLevelToGraph(l);
	}
	
	
	void connectToBorder(node s, cluster c) { l = getLevel(c);
    for (each n \in N[c])
    if (getLevel(n) < l)
    continue;
    d = searchForDistance(s; n; c);
    if (d < 1)
    addEdge(s; n; d; l; INTRA);
	}
	void insertNode(node s, int maxLevel) { for (l = 1; l =< maxLevel; l + +) { c = determineCluster(s; l);
    connectToBorder(s; c);
	}setLevel(s; maxLevel);
	}
    path hierarchicalSearch(node s; g, int l) { insertNode(s; l);
    insertNode(g; l);
    absP ath = searchForPath(s; g; l);
    llPath = refinePath(absP ath; l);
    smPath = smoothPath(llPath);
    return smPath;
	}
	}
	
	
	while (open.length > 0)
	{
		
		var best_cost = open[0].f;
		var best_node = 0;

		for (var i = 1; i < open.length; i++)
		{
			if (open[i].f < best_cost)
			{
				best_cost = open[i].f;
				best_node = i;
			}
		}

		
		var current_node = open[best_node];

		
		if (current_node.x == destination.x && current_node.y == destination.y)
		{
			var path = [destination]; 

			 
			while (current_node.parent_index != -1)
			{
				current_node = closed[current_node.parent_index];
				path.unshift(current_node);
			}

			return path;
		}

		
		open.splice(best_node, 1);

		
		closed.push(current_node);

		
		for (var new_node_x = Math.max(0, current_node.x-1); new_node_x <= Math.min(columns-1, current_node.x+1); new_node_x++)
			for (var new_node_y = Math.max(0, current_node.y-1); new_node_y <= Math.min(rows-1, current_node.y+1); new_node_y++)
			{
				if(new_node_x != current_node.x && new_node_y != current_node.y) continue; 
				var _g = board[new_node_x][new_node_y];
				if (_g != 0 
					|| (destination.x == new_node_x && destination.y == new_node_y)) 
				{
					
					var found_in_closed = false;
					for (var i in closed)
						if (closed[i].x == new_node_x && closed[i].y == new_node_y)
						{
							found_in_closed = true;
							break;
						}

					if (found_in_closed)
						continue;

					
					var found_in_open = false;
					for (var i in open)
						if (open[i].x == new_node_x && open[i].y == new_node_y)
						{
							found_in_open = true;
							break;
						}

					if (!found_in_open)
					{
						var new_node = new node(new_node_x, new_node_y, closed.length-1, -1, -1, -1);

						new_node.g = current_node.g + Math.floor(Math.sqrt(Math.pow(new_node.x-current_node.x, 2)+Math.pow(new_node.y-current_node.y, 2)));
						new_node.g += _g * 20;
						new_node.h = heuristic(new_node, destination);
						new_node.f = new_node.g+new_node.h;

						open.push(new_node);
					}
				}
			}
	}

	return [];
}


function heuristic(current_node, destination)
{

	var x = current_node.x-destination.x;
	var y = current_node.y-destination.y;
	var d = (x+y)
	return x*x+y*y;
}


*/	

function node(x, y, d, parent_index, g, h, f)
{
	this.x = x;
	this.y = y;
	this.d = d;
	this.parent_index = parent_index;
	this.g = g;
	this.h = h;
	this.f = f;
}
