// Storage Matrix Core
let isSignUpMode = false;
let globalData = [30, 70, 45, 85, 20, 60, 50];
let executionState = false;

const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const canvas = document.getElementById('visualizer-canvas');
const statusBanner = document.getElementById('status-banner');
const customInput = document.getElementById('custom-input-field');
const argumentField = document.getElementById('runtime-argument');
const argumentLabel = document.getElementById('arg-input-label');

speedSlider.addEventListener('input', (e) => { speedValue.textContent = `${e.target.value}ms`; });
function sleep() { return new Promise(resolve => setTimeout(resolve, parseInt(speedSlider.value))); }

/* --- Session Control Management System --- */
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').textContent = isSignUpMode ? "Create Student Account" : "Welcome Student";
    document.getElementById('name-group').style.display = isSignUpMode ? "block" : "none";
    document.getElementById('auth-btn').textContent = isSignUpMode ? "Create Account" : "Sign In";
    document.getElementById('auth-toggle-text').innerHTML = isSignUpMode ? 
        'Already have an account? <span onclick="toggleAuthMode()">Sign In</span>' : 
        'Don\'t have an account? <span onclick="toggleAuthMode()">Create one</span>';
}

function handleAuth(e) { 
    e.preventDefault(); 
    
    // Capture user profile parameters dynamically
    let typedName = document.getElementById('auth-name').value.trim();
    let typedEmail = document.getElementById('auth-email').value.trim();
    let displayName = (isSignUpMode && typedName) ? typedName : typedEmail.split('@')[0];
    
    // Inject identity context inside intermediate Welcome Page element
    document.getElementById('user-display-name').textContent = displayName;
    
    // Step forward to the Welcome Hub page instead of launching app directly
    document.getElementById('auth-container').style.display = 'none'; 
    document.getElementById('welcome-hub').style.display = 'flex'; 
}

function enterWorkspace() {
    // Dismiss Welcome Hub and load actual workbench viewport
    document.getElementById('welcome-hub').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex'; 
    updateWorkspaceLayout(); 
}

function logout() { 
    document.getElementById('app-container').style.display = 'none'; 
    document.getElementById('welcome-hub').style.display = 'none';
    document.getElementById('auth-container').style.display = 'flex'; 
    // Reset forms completely
    document.getElementById('auth-form').reset();
}

/* --- Dynamic Workspace Morphing Architecture --- */
function loadUserInput() {
    if (executionState) return;
    let valStr = customInput.value.trim();
    if (!valStr) return;
    
    let parsed = valStr.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num) && num > 0);
    if (parsed.length === 0) { statusBanner.textContent = "Error: Input format invalid."; return; }
    
    globalData = parsed.slice(0, 12); 
    updateWorkspaceLayout();
    statusBanner.textContent = `Successfully synchronized custom array data size context: [${globalData.join(', ')}]`;
}

function generateRandomDataset() {
    if (executionState) return;
    globalData = [];
    let size = document.getElementById('algo-select').value.includes('tree') || document.getElementById('algo-select').value.includes('graph') ? 6 : 9;
    for (let i = 0; i < size; i++) {
        globalData.push(Math.floor(Math.random() * 75) + 18);
    }
    updateWorkspaceLayout();
    statusBanner.textContent = "Generated fresh randomized testing matrix vector values.";
}

function onAlgoChange() {
    let mode = document.getElementById('algo-select').value;
    if (mode === 'array_insert') { argumentLabel.textContent = "Insert Target Value"; argumentField.value = "50"; }
    else if (mode === 'binary') { argumentLabel.textContent = "Search Target Key"; globalData.sort((a,b)=>a-b); }
    else if (mode === 'stack') { argumentLabel.textContent = "Element Item Step Cap"; argumentField.value = "4"; }
    else if (mode === 'tree' || mode === 'graph') { argumentLabel.textContent = "Root / Entry ID Key"; argumentField.value = "0"; }
    else { argumentLabel.textContent = "Target Key Element"; }
    updateWorkspaceLayout();
}

function updateWorkspaceLayout() {
    canvas.innerHTML = '';
    canvas.className = 'canvas';
    let mode = document.getElementById('algo-select').value;
    
    if (mode === 'stack') {
        canvas.classList.add('stack-layout');
        globalData.forEach(val => {
            let block = document.createElement('div');
            block.className = 'bar'; block.textContent = `Frame Block: ${val}`; block.style.height = '45px';
            canvas.appendChild(block);
        });
    } else if (mode === 'tree') {
        renderTreeWorkspace();
    } else if (mode === 'graph') {
        renderGraphWorkspace();
    } else {
        globalData.forEach(val => {
            let bar = document.createElement('div');
            bar.className = 'bar'; bar.style.height = `${val}%`; bar.textContent = val;
            canvas.appendChild(bar);
        });
    }
}

function renderTreeWorkspace() {
    let nodeCoords = [{x:50, y:15}, {x:25, y:40}, {x:75, y:40}, {x:12, y:70}, {x:38, y:70}, {x:62, y:70}];
    renderGraphElements(nodeCoords, [[0,1], [0,2], [1,3], [1,4], [2,5]]);
}

// 6 Nodes Graph Layout Setup
function renderGraphWorkspace() {
    let nodeCoords = [{x:20, y:20}, {x:50, y:15}, {x:80, y:25}, {x:25, y:65}, {x:50, y:75}, {x:75, y:65}];
    renderGraphElements(nodeCoords, [[0,1], [1,2], [0,3], [1,4], [3,4], [2,5], [4,5]]);
}

function renderGraphElements(coords, edges) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'svg-edge-layer');
    canvas.appendChild(svg);
    
    edges.forEach(e => {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', `${coords[e[0]].x}%`); line.setAttribute('y1', `${coords[e[0]].y}%`);
        line.setAttribute('x2', `${coords[e[1]].x}%`); line.setAttribute('y2', `${coords[e[1]].y}%`);
        line.setAttribute('stroke', '#1e2235'); line.setAttribute('stroke-width', '3');
        svg.appendChild(line);
    });
    
    coords.forEach((coord, index) => {
        let val = globalData[index] || 10 * index + 5;
        let el = document.createElement('div');
        el.className = 'graph-node'; el.id = `node-${index}`;
        el.style.left = `calc(${coord.x}% - 25px)`; el.style.top = `calc(${coord.y}% - 25px)`;
        el.textContent = val;
        canvas.appendChild(el);
    });
}

/* --- Execution Modules Orchestration --- */
async function runAlgorithm() {
    if (executionState) return;
    executionState = true;
    document.getElementById('start-btn').disabled = true;
    
    let mode = document.getElementById('algo-select').value;
    let arg = parseInt(argumentField.value);
    
    if (mode === 'array_insert') await execArrayInsert(arg);
    else if (mode === 'stack') await execStackSim();
    else if (mode === 'bubble') await execBubbleSort();
    else if (mode === 'binary') await execBinarySearch(arg);
    else if (mode === 'tree') await execTreeTraversal();
    else if (mode === 'graph') await execGraphBFS();
    
    executionState = false;
    document.getElementById('start-btn').disabled = false;
}

/* --- Simulation Code Logic --- */
async function execArrayInsert(val) {
    statusBanner.textContent = `Executing Array Insertion operation structural shifts for val: ${val}`;
    await sleep();
    globalData.push(val);
    let newBar = document.createElement('div');
    newBar.className = 'bar comparing'; newBar.style.height = `${val}%`; newBar.textContent = val;
    canvas.appendChild(newBar);
    statusBanner.textContent = `Appended entry ${val} cleanly into custom structural array limits vector space indices footprint.`;
    await sleep();
    newBar.classList.remove('comparing');
    newBar.classList.add('sorted');
}

async function execStackSim() {
    canvas.innerHTML = '';
    canvas.className = 'canvas stack-layout';
    
    for(let i=0; i<3; i++) {
        let item = globalData[i] || 45;
        statusBanner.textContent = `Instruction Trace execution: stack.push(${item})`;
        let node = document.createElement('div');
        node.className = 'bar comparing'; node.style.height = '45px'; node.textContent = `Element Node Stack: ${item}`;
        canvas.appendChild(node);
        await sleep();
        node.classList.remove('comparing');
    }
    await sleep();
    while(canvas.childNodes.length > 0) {
        statusBanner.textContent = "Instruction Trace step modification: stack.pop() clean contextual stack data extraction frame drop.";
        canvas.lastChild.classList.add('comparing');
        await sleep();
        canvas.removeChild(canvas.lastChild);
        await sleep();
    }
    statusBanner.textContent = "Stack trace structural framework empty.";
}

async function execBubbleSort() {
    let bars = document.getElementsByClassName('bar');
    let len = globalData.length;
    for (let i=0; i < len-1; i++) {
        for (let j=0; j < len-i-1; j++) {
            bars[j].classList.add('comparing'); bars[j+1].classList.add('comparing');
            statusBanner.textContent = `Evaluating verification indices trace logic map step: Check elements indices [${j}] > [${j+1}]`;
            await sleep();
            if (globalData[j] > globalData[j+1]) {
                let tmp = globalData[j]; globalData[j] = globalData[j+1]; globalData[j+1] = tmp;
                bars[j].style.height = `${globalData[j]}%`; bars[j].textContent = globalData[j];
                bars[j+1].style.height = `${globalData[j+1]}%`; bars[j+1].textContent = globalData[j+1];
            }
            bars[j].classList.remove('comparing'); bars[j+1].classList.remove('comparing');
        }
        bars[len-i-1].classList.add('sorted');
    }
    if(bars[0]) bars[0].classList.add('sorted');
    statusBanner.textContent = "Bubble Sort simulation cycle pipeline closed completely down sorted.";
}

async function execBinarySearch(target) {
    globalData.sort((a,b)=>a-b); updateWorkspaceLayout(); await sleep();
    let bars = document.getElementsByClassName('bar');
    let l = 0, r = globalData.length - 1;
    while(l <= r) {
        let mid = Math.floor((l+r)/2);
        bars[mid].classList.add('comparing');
        statusBanner.textContent = `Split mid address segment index boundary pointer verification map step: [${mid}]`;
        await sleep();
        if (globalData[mid] === target) {
            bars[mid].classList.remove('comparing'); bars[mid].classList.add('sorted');
            statusBanner.textContent = `Target key matched element structural data index address lock target hit: ${target}`;
            return;
        }
        bars[mid].classList.remove('comparing');
        if (globalData[mid] < target) { l = mid + 1; } else { r = mid - 1; }
    }
    statusBanner.textContent = "Binary check complete. Target element out of vector data space parameters.";
}

async function execTreeTraversal() {
    statusBanner.textContent = "Initializing Pre-Order Traversal (Root ➔ Left ➔ Right) trace pattern maps.";
    let executionRouteOrder = [0, 1, 3, 4, 2, 5];
    for(let index of executionRouteOrder) {
        let node = document.getElementById(`node-${index}`);
        if(node) {
            node.classList.add('active-node');
            statusBanner.textContent = `Traversing node address trace value element structural read key map: ${node.textContent}`;
            await sleep();
            node.classList.remove('active-node');
            node.classList.add('visited');
        }
    }
    statusBanner.textContent = "Tree pre-order structural footprint tracking completely log traced.";
}

async function execGraphBFS() {
    statusBanner.textContent = "Initializing Graph Breadth-First Search traversal tracking query loops metrics configuration.";
    let traverseSequence = [0, 1, 3, 2, 4, 5];
    for(let index of traverseSequence) {
        let node = document.getElementById(`node-${index}`);
        if(node) {
            node.classList.add('active-node');
            statusBanner.textContent = `De-queue operational graph segment step parser tracking connected node: ${node.textContent}`;
            await sleep();
            node.classList.remove('active-node');
            node.classList.add('visited');
        }
    }
    statusBanner.textContent = "Graph networks data map complete.";
}