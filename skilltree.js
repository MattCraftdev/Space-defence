import { gameState } from './main.js'
import { updateStars } from './main.js'

import { Gunner, Tank } from './main.js'

// Images
const recruitimg = document.getElementById("recruitimg");
recruitimg.src = "images/recruit.png";

const traineeimg = document.getElementById("traineeimg");
traineeimg.src = "images/trainee.png";

const veteranimg = document.getElementById("veteranimg");
veteranimg.src = "images/veteran.png";


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
const recruit = document.getElementById("recruitimg");
const trainee = document.getElementById("traineeimg");
const veteran = document.getElementById("veteranimg");

function selectNode(selectedNode) {
    console.log("Node being selected")
    const selectedNodes = [recruit, trainee, veteran];
    selectedNodes.forEach(imageNode => {
        imageNode.style.border = (imageNode === selectedNode) ? "2px solid yellow" : "";
    });
}
document.getElementById("recruitimg").addEventListener("click", () => {
    selectNode(recruit);
});

document.getElementById("traineeimg").addEventListener("click", () => {
    selectNode(trainee);
});

document.getElementById("veteranimg").addEventListener("click", () => {
    selectNode(veteran);
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


function createSkillTree(){
    console.log("creating skilll treeee")

    Object.entries(skillNodes).forEach(([name, node]) => {
    const el = document.querySelector(`.skill-node[data-skill="${name}"]`);
    if (el) {
        el.style.left = `${node.position[0].x}px`;
        el.style.top = `${node.position[0].y}px`;
        el.style.position = 'absolute';
        console.log("Nodes maked")
    }
    });

    Object.entries(skillNodes).forEach(([name, node]) => {
    node.prerequisites.forEach(prereqName => {
        const parent = skillNodes[prereqName];
        const line = document.querySelector(`line[data-connection="${prereqName}-${name}"]`);
        if (line) {
        line.setAttribute('x1', parent.position[0].x + 60);
        line.setAttribute('y1', parent.position[0].y + 25);
        line.setAttribute('x2', node.position[0].x + 60);
        line.setAttribute('y2', node.position[0].y + 25);
        console.log("Lines Created")
        }
    });
    });    
}


// exports
export { applySkills, createSkillTree }