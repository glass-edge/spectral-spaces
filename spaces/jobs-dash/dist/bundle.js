/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function init(value) {
    var _a, _b, _c;
    const element = document.getElementById('container');
    if (element == null) {
        return;
    }
    const repositories = new Map();
    for (const job of value.jobs) {
        if (repositories.has(job.repo)) {
            repositories.get(job.repo).push(job);
        }
        else {
            repositories.set(job.repo, [job]);
        }
    }
    let html = '';
    for (const [repo, jobs] of repositories) {
        jobs.sort((a, b) => {
            return a.number - b.number;
        });
        const lastJob = jobs[jobs.length - 1];
        const status = lastJob.conclusion === 'success' ? 'status-success'
            : lastJob.conclusion === 'failure' ? 'status-fail'
                : 'status-in-progress';
        html += `
      <div class="card m-2" style="width: 18rem;">
        <div class="card-img-top status ${status}">
          <a href="${lastJob.url}">
            ${(_c = (_b = ((_a = lastJob.conclusion) !== null && _a !== void 0 ? _a : lastJob.status)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : ''}
          </a>
        </div>
        <div class="card-body">
          <h5 class="card-title">${repo}</h5>
          <p class="card-text job-text">${lastJob.author}<br/>${lastJob.commit}</p>
        </div>
      </div>
    `;
    }
    element.innerHTML = html;
}
window.electron.onRenderValue((value) => __awaiter(void 0, void 0, void 0, function* () {
    init(value);
}));


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[0]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map