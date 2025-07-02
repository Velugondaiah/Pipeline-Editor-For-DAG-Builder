// DAG validation utility
export function validateDag(nodes, edges) {
  if (nodes.length < 2) {
    return { isValid: false, message: 'At least 2 nodes are required.' };
  }

  // Build adjacency list
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (e.source !== e.target) {
      adj[e.source].push(e.target);
    }
  });

  // you can Check for cycles using DFS
  const visited = {};
  const recStack = {};
  function hasCycle(v) {
    visited[v] = true;
    recStack[v] = true;
    for (const neighbor of adj[v]) {
      if (!visited[neighbor] && hasCycle(neighbor)) return true;
      else if (recStack[neighbor]) return true;
    }
    recStack[v] = false;
    return false;
  }
  for (const node of nodes) {
    if (!visited[node.id] && hasCycle(node.id)) {
      return { isValid: false, message: 'Graph contains a cycle.' };
    }
  }

  // this is for Check all nodes are connected to at least one edge
  for (const node of nodes) {
    const hasEdge = edges.some(e => e.source === node.id || e.target === node.id);
    if (!hasEdge) {
      return { isValid: false, message: `Node "${node.data?.label || node.id}" is not connected to any edge.` };
    }
  }

  return { isValid: true, message: 'Valid DAG' };
} 