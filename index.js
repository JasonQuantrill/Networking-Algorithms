function bellmanFord(edges, startNode, endNode) {
    const distances = {};
    const previous = {};
    const vertices = new Set();
    let algoTrace = 'From source to node | Weight\n'

    // Step 1: Initialize distances to all nodes as Infinity except startNode, which is 0
    for (let [start, end, distance] of edges) {
        distances[start] = Infinity;
        distances[end] = Infinity;
        vertices.add(start);
        vertices.add(end);
    }
    distances[startNode] = 0;
    console.log(JSON.stringify(distances))
    algoTrace += '\nStep 1:\n'
    for (let [node, weight] of Object.entries(distances)) {
        algoTrace += `                  ${node} | ${weight}\n`;
    }


    // Step 2: Relax edges repeatedly
    for (let i = 0; i < vertices.size - 1; i++) {
        algoTrace += `Step ${i + 2}:\n`
        for (let [start, end, distance] of edges) {
            if (distances[start] + distance < distances[end]) {
                distances[end] = distances[start] + distance;
                previous[end] = start;
            } else if (distances[end] + distance < distances[start]) {
                distances[start] = distances[end] + distance;
                previous[start] = end;
            }
        }

        for (let [node, weight] of Object.entries(distances)) {
            algoTrace += `                  ${node} | ${weight}\n`;
        }
        console.log(algoTrace)

        outputBox.value = algoTrace;
    }

    // Step 4: Build path and return result
    let path = [endNode];
    let node = endNode;
    while (previous[node]) {
        path.unshift(previous[node]);
        node = previous[node];
    }


    return path;
}


function convert(edges) {// convert our array edge to object edge
    let output = [];
    for (let i = 0; i < edges.length; i++) {
        let item = edges[i];
        console.log(item);
        output.push({ id: "ntn", from: item[0], to: item[1], label: item[2] })
    }
    return output;
}

function dijkstra(edges, startNode, endNode) {
    // Set up initial variables and data structures
    const graph = {};
    const distances = {};
    const visited = {};
    const previous = {};
    const queue = [];

    // Create graph object from edges array
    for (let [start, end, distance] of edges) {
        if (!graph[start]) graph[start] = [];
        if (!graph[end]) graph[end] = [];
        graph[start].push([end, distance]);
        graph[end].push([start, distance]);
    }

    // Initialize distances to all nodes as Infinity except startNode, which is 0
    for (let node in graph) {
        if (node == startNode) {
            distances[node] = 0;
            queue.push(parseInt(node));
        } else {
            distances[node] = Infinity;
        }
        previous[node] = null;
    }

    // Output formatting variables
    let step = 0;
    let algoTrace = 'From source to node | Weight\n'

    // Main loop
    while (queue.length) {
        // Get node with the smallest distance from startNode
        let currentNode = queue.reduce(
            (minNode, node) => distances[node] < distances[minNode] ? node : minNode
        );

        // If we've reached the endNode, we're done
        if (currentNode === endNode) {
            let path = [endNode];
            let node = endNode;
            while (previous[node]) {
                path.unshift(previous[node]);
                node = previous[node];
            }
            // return `Shortest path found: ${path.join(" -> ")} (distance ${distances[endNode]})`;
            return path;
        }

        // Visit neighbors of currentNode
        for (let [neighbor, distance] of graph[currentNode]) {
            let totalDistance = distances[currentNode] + distance;

            // Update distances if a shorter path to this neighbor is found
            if (totalDistance < distances[neighbor]) {
                distances[neighbor] = totalDistance;
                previous[neighbor] = currentNode;
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }

        // Mark currentNode as visited and remove from queue
        visited[currentNode] = true;
        queue.splice(queue.indexOf(currentNode), 1);

        // Output formatting for current step
        step++;
        algoTrace += `Step ${step}:\n`;
        for (let node in distances) {
            algoTrace += `                  ${node} | ${distances[node]}\n`;
        }
        algoTrace += '\n';

        outputBox.value = algoTrace;
    }

    return [-1];
}


class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(node, priority) {
        this.queue.push({ node, priority });
        this.sort();
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    sort() {
        this.queue.sort((a, b) => a.priority - b.priority);
    }
}


const sourceColor = {
    border: '#000000',
    background: '#7d81ff',
    highlight: {
        border: '#000000',
        background: '#7d81ff'
    }
};

const destinationColor = {
    border: '#000000',
    background: '#f59e76',
    highlight: {
        border: '#000000',
        background: '#f59e76'
    }
};

// node default color
const defaultColor = {
    border: '#2B7CE9',
    background: '#97C2FC',
    highlight: {
        border: '#2B7CE9',
        background: '#97C2FC'
    }
};

const successColor = {
    border: '#000000',
    background: '#42f569',
    highlight: {
        border: '#000000',
        background: '#42f569'
    }
};

const successColorEdge = {
    color: '#42f569',
    inherit: false
}

const defaultColorEdge = {
    color: '#2B7CE9',
    inherit: false
}

let sourceNode = null;
let destinationNode = null;

// Create an empty DataSet for nodes and edges
const nodes = new vis.DataSet([]);
const edges = new vis.DataSet([]);

function convertEdges(myEdges) { // converts the edges of the graph to a matrix usable by our algorithms
    let data = myEdges._data;
    let output = []
    console.log("data is: ", data);
    for (const [key, value] of Object.entries(data)) {
        console.log(key, value.label);
        output.push([value.from, value.to, Number(value.label)])
    }
    console.log("output is: ", output);
    return output;
}


function convertNodesArrToEdgesArr(nodeIdArray) {
    let edgesArr = []
    for (let i = 0; i < nodeIdArray.length - 1; i++) {
        edgesArr.push([nodeIdArray[i], nodeIdArray[i + 1]]);
    }
    return edgesArr;
}
// given an array of ids of nodes used in the path, returns the an array of teh actuall node_datatype and edge_datatype used in the grpah.
function findNodesAndEdges(nodeIdArray, myEdges, myNodes) {

    let edgesArr = convertNodesArrToEdgesArr(nodeIdArray);
    let chosenNode = null;
    let chosenEdge = null;

    let chosenEdgesID = [];
    let chosenNodes = [];

    let chosenEdges = [];
    let data = myEdges._data;

    // finding the actuall node objects using node ids. 
    for (let i = 0; i < nodeIdArray.length; i++) {
        chosenNode = myNodes.get(nodeIdArray[i]);
        chosenNodes.push(chosenNode);
    }

    // at this point, no id of edges
    // finding edge ids and filling the chosenEdgesID array
    for (let i = 0; i < edgesArr.length; i++) { // [1, 3]
        let arr = edgesArr[i];
        for (const [key, value] of Object.entries(data)) {
            if ((arr[0] === value.from && arr[1] === value.to) || (arr[1] === value.from && arr[0] === value.to)) {
                chosenEdgesID.push(value.id);
            }
        }
    }

    // finding edge OBJECTS
    for (let i = 0; i < chosenEdgesID.length; i++) {
        let id = chosenEdgesID[i];
        chosenEdge = edges.get(id);
        chosenEdges.push(chosenEdge);
    }

    return [chosenNodes, chosenEdges];
}



// used to find all the edges in the graph gui in the following form:  {id: 'e1', from: 1, to: 2, label: '12', color: {…}
function unwrap(edgesData) {
    let output = [];
    for (const [key, value] of Object.entries(edgesData)) {
        output.push(value);
    }
    return output;
}


function colorSuccussNodes(chosenNodes, myNodes) {
    for (let i = 0; i < chosenNodes.length; i++) {
        let chosenNode = chosenNodes[i];
        chosenNode.color = successColor; // coloring edges
        myNodes.update(chosenNode);
    }
}


function colorSuccussEdges(chosenEdges, myEdges) {
    for (let i = 0; i < chosenEdges.length; i++) {
        let chosenEdge = chosenEdges[i];
        chosenEdge.color = successColorEdge; // coloring edges
        myEdges.update(chosenEdge);
    }
}


function colorDefaultNodes(chosenNodes, myNodes) {
    for (let i = 0; i < chosenNodes.length; i++) {
        let chosenNode = chosenNodes[i];
        chosenNode.color = defaultColor; // coloring edges
        myNodes.update(chosenNode);
    }
}

function colorDefaultEdges(chosenEdges, myEdges) {
    for (let i = 0; i < chosenEdges.length; i++) {
        let chosenEdge = chosenEdges[i];
        chosenEdge.color = defaultColorEdge; // coloring edges
        myEdges.update(chosenEdge);
    }
}


// Clears text in output box on page refresh
if (localStorage.getItem('outputText')) {
    localStorage.removeItem('outputText');
}


// Create an options object for the graph
const options = {
    layout: {
        hierarchical: {
            enabled: false, // Set to false to disable hierarchical layout
        },
    },
    edges: {
        arrows: {
            to: { enabled: false, scaleFactor: 0 } // Set arrows to not appear
        },
        arrowStrikethrough: false,
        color: {
            color: '#2B7CE9',
            inherit: false
        },
        width: 5,
        font: {
            size: 20,
            strokeWidth: 5
        }
    },
    nodes: {
        shape: 'circle', // set the node shape to circle
        // ... other node properties ...
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.1,
            springLength: 150,
            springConstant: 0.05,
            damping: 0.09,
        },
        forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 100,
            springConstant: 0.08,
            damping: 0.4,
        },
        solver: 'forceAtlas2Based',
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
        },
    },
};


// Create a network instance
const container = document.getElementById('graph');
const data = { nodes, edges };
const network = new vis.Network(container, data, options);

let edgeIDCounter = 1; // Initialize a counter for generating unique edge IDs
let nodeIdCounter = 1; // Initialize a counter for generating unique node IDs

document.getElementById('setAsSourceBtn').addEventListener('click', function () {
    if (network.getSelectedNodes().length === 1) {
        const nodeId = network.getSelectedNodes()[0];
        const node = nodes.get(nodeId);

        if (destinationNode && node.id === destinationNode.id) { //selected node is destination node
            destinationNode = null; // we reset destination node
        }

        if (sourceNode) { // source node already exists.
            sourceNode.color = defaultColor;
            nodes.update(sourceNode);
        }

        sourceNode = node;
        node.color = sourceColor;
        nodes.update(node);

        console.log("selected node is: ", node)
    }
});


document.getElementById('run').addEventListener('click', function () {
    let algoChoice = document.getElementById("algoChoice");
    let choiceIndex = algoChoice.selectedIndex;

    if (sourceNode == null) {
        alert("Please set a source node");
        return;
    }

    if (destinationNode == null) {
        alert("Please set a destination node");
        return;
    }

    if (choiceIndex === 0) {
        alert("Please pick an algorithm to run");
        return;

    } else if (choiceIndex === 1) {
        console.log("running Dijkstra's Algorithm");


        let myEdges = convertEdges(edges); // step 1


        let pathNodes = dijkstra(myEdges, sourceNode.id, destinationNode.id);



        let chosenEdgesAndNodes = findNodesAndEdges(pathNodes, edges, nodes);
        let chosenNodes = chosenEdgesAndNodes[0];
        let chosenEdges = chosenEdgesAndNodes[1]

        colorSuccussEdges(chosenEdges, edges);
        colorSuccussNodes(chosenNodes, nodes);
    } else if (choiceIndex === 2) {
        console.log("running Distance Vector Algorithm");
        let myEdges = convertEdges(edges); // step 1

        let pathNodes = null;


        pathNodes = bellmanFord(myEdges, sourceNode.id, destinationNode.id); // last step: assign output to pathNodes

        let chosenEdgesAndNodes = findNodesAndEdges(pathNodes, edges, nodes);
        let chosenNodes = chosenEdgesAndNodes[0];
        let chosenEdges = chosenEdgesAndNodes[1]

        colorSuccussEdges(chosenEdges, edges);
        colorSuccussNodes(chosenNodes, nodes);
    }
});

document.getElementById('setAsDestinationBtn').addEventListener('click', function () {
    if (network.getSelectedNodes().length === 1) {
        const nodeId = network.getSelectedNodes()[0];
        const node = nodes.get(nodeId);

        if (sourceNode && node.id === sourceNode.id) { //selected node is sourceNode node
            sourceNode = null; // we reset sourceNode
        }

        if (destinationNode) { // destination node already exists.
            destinationNode.color = defaultColor;
            nodes.update(destinationNode);
        }

        destinationNode = node;
        node.color = destinationColor;
        nodes.update(node);

        console.log("selected node is: ", node)
    }
});


document.getElementById('addNodeBtn').addEventListener('click', function () {
    const newNode = { id: nodeIdCounter, label: (nodeIdCounter).toString() }; // Generate a unique ID for the new node
    nodeIdCounter++;
    nodes.add(newNode); // Add the new node to the data set
    console.log("data is: ", data);
});

// Add event listener for addEdgeBtn click
document.getElementById('addEdgeBtn').addEventListener('click', function () {
    // Update these variables with the node IDs of your choice
    let fromNodeId = null; // ID of the starting node
    let toNodeId = null; // ID of the ending node

    // let edgeId = null; // Unique edge ID
    let edgeId = edgeIDCounter;
    let label = null; // Edge label

    // Prompt user to select starting node
    network.on('click', function (params) {
        if (params.nodes.length === 1) {
            fromNodeId = params.nodes[0];
            network.off('click'); // Turn off click event listener
            promptForToNode(); // Call function to prompt for ending node
        }
    });

    // Function to prompt user for ending node
    function promptForToNode() {
        // Prompt user to select ending node
        network.on('click', function (params) {

            if (params.nodes.length === 1 && params.nodes[0] !== fromNodeId) {


                toNodeId = params.nodes[0];
                network.off('click'); // Turn off click event listener

                // Generate a unique edge ID
                edgeId = `e${edgeIDCounter}`;

                // Prompt user for edge label
                label = prompt('Enter edge weight:');


                // Add the edge with specified fromNodeId, toNodeId, and label
                if ((Number(label) || Number(label) === 0) && label !== null && Number(label) >= 0) { // if it is a number
                    edges.add({ id: edgeId, from: fromNodeId, to: toNodeId, label: label });
                    edgeIDCounter++
                } else {
                    alert("Please make sure to enter a positive number as the edge weight ");
                }
            }
        });
    }
});

// Add event listener for deleteNodeBtn click
document.getElementById('deleteNodeBtn').addEventListener('click', function () {
    if (network.getSelectedNodes().length === 1) {
        const nodeId = network.getSelectedNodes()[0];
        nodes.remove({ id: nodeId });
        network.deleteSelected();
    }
});

// Add event listener for deleteEdgeBtn click
document.getElementById('deleteEdgeBtn').addEventListener('click', function () {
    if (network.getSelectedEdges().length === 1) {
        const edgeId = network.getSelectedEdges()[0];
        edges.remove({ id: edgeId });
        network.deleteSelected();
    }
});



// // Add event listener for resetBtn click
document.getElementById("resetBtn").addEventListener('click', function () {
    sourceNode = null;
    destinationNode = null;
    // reseting edge color
    let edgesEdges = unwrap(edges._data);
    colorDefaultEdges(edgesEdges, edges);
    // reseting node color
    console.log("nodes is: ", nodes);
    let nodesNodes = unwrap(nodes._data);
    colorDefaultNodes(nodesNodes, nodes);
    outputBox.value = "";




})

// Add event listener for node edit event
network.on('doubleClick', function (params) {
    if (params.nodes.length === 1) {
        const nodeId = params.nodes[0];
        const nodeLabel = nodes.get(nodeId).label;
        const newLabel = prompt(`Edit label for Node ${nodeId}:`, nodeLabel);
        if (newLabel !== null) {
            nodes.update({ id: nodeId, label: newLabel });
        }
    }
});

// Add event listener for edge edit event
network.on('doubleClick', function (params) {

    if (params.edges.length === 1 && params.nodes.length === 0) { // had to specify that no node is selected
        const edgeId = params.edges[0];
        const edgeLabel = edges.get(edgeId).label;
        const newLabel = prompt(`Edit label for Edge ${edgeId}:`, edgeLabel);
        if (newLabel !== null) {
            edges.update({ id: edgeId, label: newLabel });
        }
    }
});

// Add event listener for edge select event
network.on('selectEdge', function (params) {
    const edgeId = params.edges[0];
    const edgeLabel = edges.get(edgeId).label;
    console.log(`Selected edge: ${edgeId}, Label: ${edgeLabel}`);
});

// Add event listener for node select event
network.on('selectNode', function (params) {
    const nodeId = params.nodes[0];
    const nodeLabel = nodes.get(nodeId).label;

    console.log("params is: ", params);
    console.log(`Selected node: ${nodeId}, Label: ${nodeLabel}`);
});

// Add event listener for deselect event
network.on('deselectNode', function (params) {
    console.log('Deselected node:', params.previousSelection.nodes);
});

// Add event listener for deselect event
network.on('deselectEdge', function (params) {
    console.log('Deselected edge:', params.previousSelection.edges);
});

// Function to get node ID at given coordinates
function getNodeIdAtCoordinates(x, y) {
    const nodeId = network.getNodeAt({ x: x, y: y });
    return nodeId !== null ? nodeId : undefined;
}

// Add event listener for click event to create edge
let edgeFrom = null;
let edgeTo = null;
let edgeCounter = 1;

// Add event listner to clear the page
document.getElementById('clearAllBtn').addEventListener('click', function () {
    nodes.clear(); // Clear all nodes from the data set
    edges.clear(); // Clear all edges from the data set
    sourceNode = null;
    destinationNode = null;
    nodeIdCounter = 1;
    outputBox.value = "";
});