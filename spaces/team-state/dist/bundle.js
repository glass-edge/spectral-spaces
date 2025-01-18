/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Constellation_1 = __importDefault(__webpack_require__(1));
const TaskArc_1 = __importDefault(__webpack_require__(3));
const TaskWheel_1 = __importDefault(__webpack_require__(5));
const Light_1 = __importDefault(__webpack_require__(6));
const Theme_1 = __importDefault(__webpack_require__(2));
const lightTheme = new Light_1.default();
const dataRoot = eval(window.electron.fs.readFileSync('src/test-data.js', { encoding: 'utf-8' }));
function init(value) {
    const container = document.getElementById('viewportContainer');
    const canvas = document.getElementById('viewport');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    {
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, 'rgba(206, 197, 174, 0.5)'); // '#cec5ae')
        g.addColorStop(1, 'rgba(39, 4, 182, 0.5)'); //'#2704b6')
        ctx.fillStyle = g;
        // ctx.fillStyle = Theme.style.background.fill ?? ctx.fillStyle
        ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    }
    const innerRadius = 140;
    const outerRadius = 360;
    const externalRadius = 720;
    ctx.beginPath();
    Theme_1.default.style.background.apply(ctx);
    {
        const g = ctx.createRadialGradient(0, 0, outerRadius + 56, 0, 0, outerRadius + 76);
        g.addColorStop(0, 'rgba(255, 255, 255, 0)');
        g.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
        ctx.fillStyle = g;
    }
    ctx.arc(0, 0, outerRadius + 76, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    const constellation = new Constellation_1.default(dataRoot);
    constellation.draw(ctx, innerRadius);
    const taskWheel = new TaskWheel_1.default(constellation.outerNodes);
    taskWheel.draw(ctx, innerRadius, outerRadius);
    const leftData = [];
    for (let i = 0; i < 60; i++) {
        leftData.push({
            name: 'DMC-1250 Some bug' + ' to fix'.repeat(i % 5),
            assignee: 'John Doe'.repeat(i % 3 + 1),
        });
    }
    const rightData = [];
    for (let i = 0; i < 5; i++) {
        rightData.push({
            name: 'DMC-1351 Some activity' + ' to do'.repeat(i % 5),
            assignee: 'Jane Doe'.repeat(i % 3 + 1),
        });
    }
    const leftArc = new TaskArc_1.default(leftData, 'left');
    leftArc.draw(ctx, outerRadius + 80, externalRadius);
    const rightArc = new TaskArc_1.default(rightData, 'right');
    rightArc.draw(ctx, outerRadius + 80, externalRadius);
    ctx.restore();
}
window.electron.onRenderValue((value) => __awaiter(void 0, void 0, void 0, function* () {
    init(value);
}));


/***/ }),
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Theme_1 = __importDefault(__webpack_require__(2));
class Constellation {
    constructor(data) {
        this._data = data;
        this._depth = this._treeDepth(data);
        this._normalizeTree(data, 0, this._depth - 1);
    }
    get outerNodes() {
        return this._getNodesAtDepth(this._data, this._depth - 1);
    }
    draw(ctx, radius = 180) {
        var _a;
        ctx.save();
        const radiusStep = radius / (this._depth - 1);
        let prevLevelNodes = undefined;
        for (let ilevel = this._depth - 1; ilevel >= 0; ilevel--) {
            const levelRadius = radiusStep * ilevel;
            if (ilevel === 0) {
                Theme_1.default.style.background.apply(ctx);
                (_a = this._data.children) === null || _a === void 0 ? void 0 : _a.forEach((node, i) => {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(node.renderData.x, node.renderData.y);
                    ctx.stroke();
                });
                break;
            }
            const levelNodes = this._getNodesAtDepth(this._data, ilevel);
            if (prevLevelNodes == null) {
                const angleStep = 2 * Math.PI / levelNodes.length;
                levelNodes.forEach((node, i) => {
                    const angle = i * angleStep;
                    const x = Math.cos(angle) * levelRadius;
                    const y = Math.sin(angle) * levelRadius;
                    node.renderData = { x, y, angle };
                });
                prevLevelNodes = levelNodes;
                continue;
            }
            ctx.save();
            ctx.beginPath();
            if (ilevel % 2 === 0) {
                Theme_1.default.style.neutral.apply(ctx, true);
            }
            else {
                Theme_1.default.style.background.apply(ctx, true);
            }
            ctx.arc(0, 0, levelRadius, 0, 2 * Math.PI);
            ctx.shadowBlur = radiusStep * 0.25;
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            levelNodes.forEach(node => {
                if (node.children == null || node.children.length === 0) {
                    return;
                }
                const averageAngle = node.children.reduce((acc, child) => {
                    return acc + child.renderData.angle;
                }, 0) / node.children.length;
                const x = Math.cos(averageAngle) * levelRadius;
                const y = Math.sin(averageAngle) * levelRadius;
                node.renderData = { x, y, angle: averageAngle };
                Theme_1.default.style.background.apply(ctx);
                node.children
                    .filter(child => child.name != null)
                    .forEach(child => {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(child.renderData.x, child.renderData.y);
                    ctx.stroke();
                });
            });
        }
        this._allNodes(this._data).forEach(node => {
            if (node.name != null && node.renderData != null) {
                this._drawDot(ctx, node.renderData.x, node.renderData.y, node);
            }
        });
        this._drawDot(ctx, 0, 0, this._data);
        ctx.restore();
    }
    _allNodes(node) {
        var _a, _b;
        if (node == null) {
            return [];
        }
        return [node, ...((_b = (_a = node.children) === null || _a === void 0 ? void 0 : _a.flatMap(this._allNodes.bind(this))) !== null && _b !== void 0 ? _b : [])];
    }
    _getNodesAtDepth(node, depth) {
        var _a, _b;
        if (node == null) {
            return [];
        }
        if (depth === 0) {
            return [node];
        }
        return (_b = (_a = node.children) === null || _a === void 0 ? void 0 : _a.flatMap(child => this._getNodesAtDepth(child, depth - 1))) !== null && _b !== void 0 ? _b : [];
    }
    _normalizeTree(node, depth, toDepth) {
        if (node == null || depth === toDepth) {
            return;
        }
        if (node.children == null || node.children.length === 0) {
            node.children = [{ status: 'missing' }];
        }
        node.children.forEach(child => {
            this._normalizeTree(child, depth + 1, toDepth);
        });
    }
    _treeDepth(node) {
        if (node == null) {
            return 0;
        }
        if (node.children == null || node.children.length === 0) {
            return 1;
        }
        return 1 + Math.max(...node.children.map(this._treeDepth.bind(this)));
    }
    _drawDot(ctx, x, y, node) {
        ctx.save();
        Theme_1.default.status(node.status).apply(ctx);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}
exports["default"] = Constellation;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Theme {
    constructor(root) {
        Theme.style = root;
        const walk = (node) => {
            if (typeof node !== 'object') {
                return;
            }
            for (const key in node) {
                if (typeof node[key] !== 'object') {
                    continue;
                }
                node[key].apply = (ctx, shadow) => {
                    this._apply(ctx, node[key], shadow);
                };
                walk(node[key]);
            }
        };
        walk(root);
    }
    static status(status) {
        if (status != null && status in Theme.style.status) {
            return Theme.style.status[status];
        }
        switch (status) {
            case 'Missing':
                return Theme.style.status.missing;
            case 'In Progress':
                return Theme.style.status.inProgress;
            case 'In Review':
                return Theme.style.status.inReview;
            case 'Done':
                return Theme.style.status.done;
            default:
                return Theme.style.status.todo;
        }
    }
    _apply(ctx, item, shadow = false) {
        var _a, _b, _c, _d, _e, _f;
        ctx.fillStyle = (_a = item.fill) !== null && _a !== void 0 ? _a : ctx.fillStyle;
        ctx.strokeStyle = (_b = item.stroke) !== null && _b !== void 0 ? _b : ctx.strokeStyle;
        ctx.font = (_c = item.font) !== null && _c !== void 0 ? _c : ctx.font;
        ctx.lineWidth = (_d = item.lineWidth) !== null && _d !== void 0 ? _d : ctx.lineWidth;
        if (shadow) {
            ctx.shadowBlur = (_e = item.shadowBlur) !== null && _e !== void 0 ? _e : ctx.shadowBlur;
            ctx.shadowColor = (_f = item.shadowColor) !== null && _f !== void 0 ? _f : ctx.shadowColor;
        }
    }
}
exports["default"] = Theme;


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Util_1 = __webpack_require__(4);
const Theme_1 = __importDefault(__webpack_require__(2));
class TaskArc {
    constructor(data, side) {
        this._data = data;
        this._leftSide = side === 'left';
    }
    draw(ctx, innerRadius, outerRadius) {
        var _a, _b;
        ctx.save();
        const externalAngle = Math.PI * 0.2;
        const namePartition = 0.66;
        const startAngle = this._leftSide ? Math.PI - externalAngle : -externalAngle;
        const endAngle = this._leftSide ? Math.PI + externalAngle : externalAngle;
        ctx.save();
        if (this._leftSide) {
            Theme_1.default.style.leftArc.apply(ctx, true);
        }
        else {
            Theme_1.default.style.rightArc.apply(ctx, true);
        }
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, startAngle, endAngle);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        const maxItemCount = 50;
        const itemCount = Math.min(maxItemCount, this._data.length);
        const stepAngle = externalAngle * 2 / (maxItemCount - 1);
        const extraCount = this._data.length - itemCount;
        for (let i = 0; i < itemCount; i++) {
            const item = this._data[i];
            const angle = this._leftSide
                ? endAngle - i * stepAngle - externalAngle * (1 - itemCount / maxItemCount)
                : startAngle + i * stepAngle + externalAngle * (1 - itemCount / maxItemCount);
            ctx.save();
            if (this._leftSide) {
                ctx.scale(-1, -1);
                ctx.rotate(angle);
                ctx.translate(-outerRadius + 10, 0);
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                (_a = Theme_1.default.style.neutral.text) === null || _a === void 0 ? void 0 : _a.apply(ctx);
                ctx.font = '10px Arial';
                if (i == itemCount - 1 && extraCount > 0) {
                    ctx.fillText(`...and ${extraCount + 1} more`, 0, 0);
                }
                else {
                    ctx.fillText((0, Util_1.truncateText)(ctx, item.name, (outerRadius - innerRadius) * namePartition), 0, 0);
                    if (item.assignee != null) {
                        ctx.fillText((0, Util_1.truncateText)(ctx, item.assignee, (outerRadius - innerRadius) * (1 - namePartition) - 20), (outerRadius - innerRadius) * namePartition + 10, 0);
                    }
                }
            }
            else {
                ctx.rotate(angle);
                ctx.translate(outerRadius - 10, 0);
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                (_b = Theme_1.default.style.neutral.text) === null || _b === void 0 ? void 0 : _b.apply(ctx);
                ctx.font = '10px Arial';
                if (i == itemCount - 1 && extraCount > 0) {
                    ctx.fillText(`...and ${extraCount + 1} more`, 0, 0);
                }
                else {
                    ctx.fillText((0, Util_1.truncateText)(ctx, item.name, (outerRadius - innerRadius) * namePartition), 0, 0);
                    if (item.assignee != null) {
                        ctx.fillText((0, Util_1.truncateText)(ctx, item.assignee, (outerRadius - innerRadius) * (1 - namePartition) - 20), -(outerRadius - innerRadius) * namePartition - 10, 0);
                    }
                }
            }
            ctx.restore();
        }
        ctx.restore();
    }
}
exports["default"] = TaskArc;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.truncateText = truncateText;
function truncateText(ctx, text, maxWidth) {
    let width = ctx.measureText(text).width;
    const ellipsis = '...';
    const ellipsisWidth = ctx.measureText(ellipsis).width;
    if (width <= maxWidth || width <= ellipsisWidth) {
        return text;
    }
    let len = text.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        text = text.substring(0, len);
        width = ctx.measureText(text).width;
    }
    return text + ellipsis;
}


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Util_1 = __webpack_require__(4);
const Theme_1 = __importDefault(__webpack_require__(2));
class TaskWheel {
    constructor(data) {
        this._data = data;
    }
    draw(ctx, innerRadius = 140, outerRadius = 360) {
        ctx.save();
        const step = 2 * Math.PI / this._data.length;
        // Draw basic setup
        ctx.save();
        this._data.forEach((node, i) => {
            Theme_1.default.status(node.status).apply(ctx);
            ctx.beginPath();
            this._drawGeometry(ctx, step, step * i, innerRadius, outerRadius);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        });
        ctx.restore();
        // Draw highlighted elements
        ctx.save();
        this._data.forEach((node, i) => {
            var _a;
            if (!['In Progress', 'In Review', 'Done'].includes((_a = node.status) !== null && _a !== void 0 ? _a : '')) {
                return;
            }
            Theme_1.default.status(node.status).apply(ctx, true);
            ctx.beginPath();
            this._drawGeometry(ctx, step, step * i, innerRadius, outerRadius);
            ctx.stroke();
        });
        ctx.restore();
        // Fill elements
        ctx.save();
        this._data.forEach((node, i) => {
            if (!this._setupFills(ctx, node, innerRadius, outerRadius)) {
                return;
            }
            ctx.beginPath();
            this._drawGeometry(ctx, step, step * i, innerRadius, outerRadius);
            ctx.fill();
            ctx.closePath();
        });
        ctx.restore();
        // Draw text
        ctx.save();
        this._data.forEach((node, i) => {
            var _a, _b, _c, _d, _e;
            const angle = step * i;
            if (node.name == null) {
                (_a = Theme_1.default.style.status.missing.text) === null || _a === void 0 ? void 0 : _a.apply(ctx);
            }
            else {
                (_b = Theme_1.default.style.neutral.text) === null || _b === void 0 ? void 0 : _b.apply(ctx);
            }
            if (node.name != null) {
                this._drawText(ctx, (0, Util_1.truncateText)(ctx, (_c = node.name) !== null && _c !== void 0 ? _c : 'Unavailable', outerRadius - innerRadius - 50), angle, innerRadius, 0, 2);
            }
            if (node.assignee == null) {
                (_d = Theme_1.default.style.status.missing.text) === null || _d === void 0 ? void 0 : _d.apply(ctx);
            }
            else {
                (_e = Theme_1.default.style.neutral.text) === null || _e === void 0 ? void 0 : _e.apply(ctx);
            }
            if (node.assignee != null) {
                this._drawText(ctx, (0, Util_1.truncateText)(ctx, node.assignee != null ? node.assignee : 'Unassigned', outerRadius - innerRadius - 50), angle, innerRadius, 1, 2);
            }
        });
        ctx.restore();
        // Draw PRs
        ctx.save();
        this._data.forEach((node, i) => {
            var _a;
            (_a = node.prs) === null || _a === void 0 ? void 0 : _a.forEach((pr, j) => {
                var _a, _b;
                this._drawPR(ctx, step, step * i, j, (_b = (_a = node.prs) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0, pr.status, outerRadius + 4);
            });
        });
        ctx.restore();
    }
    _drawText(ctx, text, angle, radius, lineNumber, lineCount) {
        ctx.save();
        const lineAngle = 2 * Math.atan2(8, radius);
        const curLineAngle = lineAngle * (lineNumber - (lineCount - 1) / 2);
        if (Math.cos(angle) > 0) {
            ctx.rotate(angle + curLineAngle);
            ctx.translate(radius + 10, 0);
            ctx.textAlign = 'left';
        }
        else {
            ctx.scale(-1, -1);
            ctx.rotate(angle - curLineAngle);
            ctx.translate(-radius - 10, 0);
            ctx.textAlign = 'right';
        }
        ctx.textBaseline = 'middle';
        ctx.font = '12px Arial';
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
    _drawPR(ctx, fullStep, fullAngle, currentItemIndex, itemCount, itemStatus, outerRadius) {
        const shrink = 0.8;
        const itemSpan = Math.PI * 0.01739;
        const itemRadiusStep = 10;
        const rowSize = Math.floor(fullStep / itemSpan);
        const angle = fullAngle - itemSpan * Math.min(itemCount, rowSize) / 2 + itemSpan * (0.5 + currentItemIndex % rowSize);
        const step = itemSpan * 0.6;
        const minRadius = outerRadius + itemRadiusStep * Math.floor(currentItemIndex / rowSize);
        const maxRadius = minRadius + itemRadiusStep * shrink;
        ctx.beginPath();
        ctx.arc(0, 0, (minRadius + maxRadius) / 2, angle - step / 2, angle + step / 2);
        Theme_1.default.status(itemStatus).apply(ctx);
        ctx.lineWidth = itemRadiusStep * 0.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    }
    _drawGeometry(ctx, step, angle, innerRadius, outerRadius) {
        const csNext = { cos: Math.cos(angle + step / 2), sin: Math.sin(angle + step / 2) };
        const csPrev = { cos: Math.cos(angle - step / 2), sin: Math.sin(angle - step / 2) };
        ctx.moveTo(csPrev.cos * innerRadius, csPrev.sin * innerRadius);
        ctx.lineTo(csPrev.cos * outerRadius, csPrev.sin * outerRadius);
        ctx.arc(0, 0, outerRadius, angle - step / 2, angle + step / 2);
        ctx.lineTo(csNext.cos * innerRadius, csNext.sin * innerRadius);
        ctx.arc(0, 0, innerRadius, angle + step / 2, angle - step / 2, true);
    }
    _setupFills(ctx, node, innerRadius, outerRadius) {
        var _a, _b, _c, _d;
        // TODO: Support completion for all statuses
        if (node.status === 'In Progress') {
            if (node.completion != null) {
                const g = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius);
                g.addColorStop(0, (_a = Theme_1.default.style.status.inProgress.fill) !== null && _a !== void 0 ? _a : 'black');
                g.addColorStop(node.completion, (_b = Theme_1.default.style.status.inProgress.fill) !== null && _b !== void 0 ? _b : 'black');
                g.addColorStop(node.completion, (_c = Theme_1.default.style.neutral.fill) !== null && _c !== void 0 ? _c : 'white');
                g.addColorStop(1, (_d = Theme_1.default.style.neutral.fill) !== null && _d !== void 0 ? _d : 'white');
                ctx.fillStyle = g;
            }
            else {
                Theme_1.default.status(node.status).apply(ctx);
            }
            return true;
        }
        else if (node.status === 'In Review') {
            Theme_1.default.status(node.status).apply(ctx);
            return true;
        }
        else if (node.status === 'Done') {
            Theme_1.default.status(node.status).apply(ctx);
            return true;
        }
        return false;
    }
}
exports["default"] = TaskWheel;


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Theme_1 = __importDefault(__webpack_require__(2));
class Light extends Theme_1.default {
    constructor() {
        super(Light.style);
    }
    enable() {
        Theme_1.default.style = Light.style;
    }
}
Light.style = {
    background: {
        fill: '#fff',
        stroke: '#999',
        shadowColor: '#bbb',
        shadowBlur: 10,
        lineWidth: 1
    },
    neutral: {
        fill: '#f8f8f8',
        stroke: '#999',
        shadowColor: '#bbb',
        shadowBlur: 10,
        lineWidth: 1,
        text: {
            fill: '#000'
        }
    },
    leftArc: {
        fill: '#f8f8f8',
        stroke: '#600',
        shadowColor: '#c00',
        shadowBlur: 10,
        lineWidth: 2
    },
    rightArc: {
        fill: '#f8f8f8',
        stroke: '#006',
        shadowColor: '#00c',
        shadowBlur: 10,
        lineWidth: 2
    },
    status: {
        missing: {
            fill: '#fff',
            stroke: '#999',
            shadowBlur: 0,
            lineWidth: 1,
            text: {
                fill: '#aaa'
            }
        },
        todo: {
            fill: '#f8f8f8',
            stroke: '#999',
            shadowBlur: 0,
            lineWidth: 1
        },
        inProgress: {
            fill: '#d3d9fe',
            stroke: '#7a87dd',
            shadowColor: '#7a87dd',
            shadowBlur: 16,
            lineWidth: 3
        },
        inReview: {
            fill: '#cefffc',
            stroke: '#6dcdc6',
            shadowColor: '#6dcdc6',
            shadowBlur: 16,
            lineWidth: 3
        },
        done: {
            fill: '#c0ffbc',
            stroke: '#7ee177',
            shadowColor: '#7ee177',
            shadowBlur: 16,
            lineWidth: 3
        }
    }
};
exports["default"] = Light;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map