// Imports
import { gameState } from './main.js'
import { updateStars } from './main.js'
import { Gunner, Tank } from './main.js'

// Images
const recruitimg = document.getElementById("Recruit");
recruitimg.src = "images/recruit.png";

const traineeimg = document.getElementById("Trainee");
traineeimg.src = "images/trainee.png";

const veteranimg = document.getElementById("Veteran");
veteranimg.src = "images/veteran.png";

// Skill nodes
const skillNodes = {

    "Recruit": {
        description: " I'm the new recruit.. [Unlocks Gunner] ",
        unlocked: true,
        cost: 0,
        prerequisites: [],
        position: [ { x: 50, y: 100 } ]
    },
    "Trainee": {
        description: " I'm better, but not better enough! [Level 2 Gunner available!] ",
        unlocked: false,
        cost: 1,
        prerequisites: ["Recruit"],
        position: [ { x: 50, y: 300 } ]
    },
    "Veteran": {
        description: " This job sucks [Level 3 Gunner available!] ",
        unlocked: false,
        cost: 2,
        prerequisites: ["Trainee"],
        position: [ { x: 50, y: 500 } ]
    },
}

// Clicking images to unlock stuff
let selectedNode = null;
let selectedNodeName = null;

const recruit = document.getElementById("Recruit");
const trainee = document.getElementById("Trainee");
const veteran = document.getElementById("Veteran");

function selectNode(clickedNode) {
    console.log("Node being selected")
    const selectedNodes = [recruit, trainee, veteran];
    selectedNodes.forEach(node => {
        node.style.border = (node === clickedNode) ? "2px solid yellow" : "2px solid gray";
    });
    selectedNodeName = clickedNode.id;
    updateUpgradeStats();
}

document.getElementById("Recruit").addEventListener("click", () => {
    selectNode(recruit);
});

document.getElementById("Trainee").addEventListener("click", () => {
    selectNode(trainee);
});

document.getElementById("Veteran").addEventListener("click", () => {
    selectNode(veteran);
});

selectNode(recruit);

// Update the stats of the new node selected
function updateUpgradeStats() {
    if (selectedNodeName) {
        const node = skillNodes[selectedNodeName];
        document.getElementById("upgradestats").textContent = `Name: ${selectedNodeName}, Cost: ${node.cost}`;
    } else {
        document.getElementById("upgradestats").textContent = "Select a node to see details.";
    }
}

// Buy a node
document.getElementById("buyNode").addEventListener("click", () => {
    if (selectedNodeName) {
        unlockSkill(selectedNodeName);
    } else {
        console.log("No node selected.");
    }
});

// Unlock skills
function unlockSkill(skillname) {
    const skill = skillNodes[skillname]

    if (skill.unlocked === true) {
        console.log("Already Unlocked")
    } else {

        const prerequisitesMet = skill.prerequisites.every(prereq => skillNodes[prereq].unlocked);
        if (!prerequisitesMet) {
            console.log("Prerequisites not met");
            return;

        } else {
            if (gameState.starcount >= skill.cost) {
                skill.unlocked = true;
                gameState.starcount -= skill.cost;
                updateStars();
                console.log("Bought upgrade!");
            } else {
                console.log("You're poor.")
            }
        }
    }
}

// Do effects here, export to main.js
function applySkills() {
    if (skillNodes.Trainee.unlocked === true) {
        Gunner.maxlevel = 2;
        if (skillNodes.Veteran.unlocked === true) {
            Gunner.maxlevel = 3;
        }
    }
}

// Creates the skill tree (poisitioning, lines, etc.)
function createSkillTree(){

    console.log("Constructing Skill tree")
    const svg = document.getElementById("skillLines")

    Object.entries(skillNodes).forEach(([name, node]) => {
        const el = document.getElementById(name)
        if (el) {
            el.style.left = `${node.position[0].x}px`;
            el.style.top = `${node.position[0].y}px`;
            el.style.position = 'absolute';
            el.title = node.description
            console.log("Nodes maked")
        }

        node.prerequisites.forEach(prereqName => {
            const parent = skillNodes[prereqName];
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

            if (line) {
                line.setAttribute("id", `${prereqName}-${name}`);
                line.setAttribute("stroke-width", "2");
                line.setAttribute("stroke", "#000000"); 
                line.setAttribute('x1', parent.position[0].x + 50);
                line.setAttribute('y1', parent.position[0].y);
                line.setAttribute('x2', node.position[0].x + 50);
                line.setAttribute('y2', node.position[0].y);
                
                svg.appendChild(line)
                console.log("Lines Created")
            }
        });
    });
}

// exports
export { applySkills, createSkillTree }