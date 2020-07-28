const matrix = [
    [1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [1 ,1, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
]

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fScore = 0;
        this.hScore = 0;
        this.gScore = 0;
        this.parent = null;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

const openList = [];
const closeList = [];
let startPoint = new Point(4, 2);
let distinationPoint = new Point(0, 0);
openList.push(startPoint);

// calculate the manhattan distance between two points
const manhattanDistance = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const pointCalculator = (distinationPoint, abailablePoint, currentPoint) => {
    let hScore = manhattanDistance(distinationPoint.x, distinationPoint.y, abailablePoint.x, abailablePoint.y);
    let gScore = manhattanDistance(distinationPoint.x, distinationPoint.y, startPoint.x, startPoint.y);
    let fScore = hScore + gScore;
    let result = new Point(abailablePoint.x, abailablePoint.y);
    result.fScore = fScore;
    result.gScore = gScore;
    result.hScore = hScore;
    result.parent = currentPoint;
    return result;
}

const getAvailablePoints = (currentPoint) => {
    let availablePoints = []
    // find valid point from left, up ,down
    if (currentPoint.x - 1 >= 0 && matrix[currentPoint.y][currentPoint.x - 1]) {
        availablePoints.push(new Point(currentPoint.x - 1, currentPoint.y));
    }
    if (currentPoint.y + 1 <= 4 && matrix[currentPoint.y + 1][currentPoint.x]) {
        availablePoints.push(new Point(currentPoint.x, currentPoint.y + 1));
    }
    if (currentPoint.y - 1 >= 0 && matrix[currentPoint.y - 1][currentPoint.x]) {
        availablePoints.push(new Point(currentPoint.x, currentPoint.y - 1));
    }

    let existList = openList.concat(closeList);

    // remove from available points if already exist
    existList.forEach(point => {
        for (let i = 0; i < availablePoints.length; i++) {
            if (point.toString() == availablePoints[i].toString()) {
                availablePoints.splice(i, 1);
            }
        }
    })

    return availablePoints;
}

const getMinPoint = (openList) => {
    let min;
    if (openList.length == 1) {
        return openList[0];
    }
    for (let i = 0; i < openList.length - 1; i++) {
        min = openList[i].fScore <= openList[i + 1].fScore ? openList[i] : openList[i + 1];
    }
    return min;
}

const AStarSearch = (distinationPoint, currentPoint) => {
    // move CP to closeList
    let index = openList.indexOf(currentPoint);
    if (index > -1) {
        closeList.push(openList[index]);
        openList.splice(index, 1);
    }
    // find available points from CP
    let availablePoints = getAvailablePoints(currentPoint);
    // calculate each point scores and set parent to CP
    for (let i = 0; i < availablePoints.length; i++) {
        availablePoints[i] = pointCalculator(distinationPoint, availablePoints[i], currentPoint);
    }
    // push all available points to openList
    availablePoints.forEach(point => openList.push(point));
}

const main = () => {
    let currentPoint;
    let route = [];
    while (true) {
        if (openList.length == 0) {
            console.log('no route')
            break;
        }
        // get one of the min-score point
        currentPoint = getMinPoint(openList);
        console.log(`current point: ${currentPoint.toString()}`)
        if (currentPoint.toString() == distinationPoint.toString()) {
            break;
        }
        AStarSearch(distinationPoint, currentPoint);
    }
    console.log('A* search finish');
    while(currentPoint.parent != null) {
        route.push(currentPoint.toString())
        currentPoint = currentPoint.parent;
    }
    // print the route
    route = route.reverse();
    console.log(route.join(' -> '));
}

main();