function breadthFirstSearch(graph, startNode, targetNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);
  const parent = {};

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode === targetNode) {
      // Found the target node, trace back the path from target to start
      const shortestPath = [];
      let node = targetNode;
      while (node !== startNode) {
        shortestPath.unshift(node);
        node = parent[node];
      }
      shortestPath.unshift(startNode); // Include the start node
      console.log("Shortest path:", shortestPath);
      return true;
    }

    for (const neighbor of graph[currentNode]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        visited.add(neighbor);
        parent[neighbor] = currentNode; // Store the parent node
      }
    }
  }

  console.log("Target node not found!");
  return false;
}

// Example graph (adjacency list)
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A'],
  D: ['B',],
  E: ['B', 'F'],
  F: ['C', 'E']
};

// Example usage
const startNode = 'A';
const targetNode = 'F';
breadthFirstSearch(graph, startNode, targetNode);
