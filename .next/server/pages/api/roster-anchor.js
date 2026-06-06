"use strict";
(() => {
var exports = {};
exports.id = 382;
exports.ids = [382];
exports.modules = {

/***/ 5142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 5060:
/***/ ((module) => {

module.exports = require("drizzle-orm");

/***/ }),

/***/ 911:
/***/ ((module) => {

module.exports = require("drizzle-orm/node-postgres");

/***/ }),

/***/ 4689:
/***/ ((module) => {

module.exports = require("drizzle-orm/pg-core");

/***/ }),

/***/ 5900:
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ 4552:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

// EXTERNAL MODULE: ./src/db/index.ts
var db = __webpack_require__(8825);
// EXTERNAL MODULE: ./src/db/schema.ts
var schema = __webpack_require__(8598);
// EXTERNAL MODULE: external "drizzle-orm"
var external_drizzle_orm_ = __webpack_require__(5060);
;// CONCATENATED MODULE: ./src/services/roster-anchor-service.ts



function parseDdMmYyyy(input) {
    // expect ddmmyyyy like 15102023
    if (!/^[0-9]{8}$/.test(input)) throw new Error("invalid date format");
    const dd = input.slice(0, 2);
    const mm = input.slice(2, 4);
    const yyyy = input.slice(4, 8);
    const iso = `${yyyy}-${mm}-${dd}`;
    return iso;
}
async function createRosterAnchor({ employee_id, anchor_date }) {
    const iso = parseDdMmYyyy(anchor_date);
    const res = await db.db.insert(schema/* roster_anchors */.GO).values({
        employee_id,
        anchor_date: iso
    }).returning();
    return res;
}
async function updateRosterAnchor({ employee_id, anchor_date }) {
    const iso = parseDdMmYyyy(anchor_date);
    const res = await db.db.update(schema/* roster_anchors */.GO).set({
        anchor_date: iso
    }).where((0,external_drizzle_orm_.eq)(schema/* roster_anchors */.GO.employee_id, employee_id)).returning();
    return res;
}
/* harmony default export */ const roster_anchor_service = ({
    createRosterAnchor,
    updateRosterAnchor
});

;// CONCATENATED MODULE: ./src/routes/roster-anchor-route.ts

async function postHandler(req, res) {
    try {
        const { employee_id, anchor_date } = req.body;
        if (!employee_id || !anchor_date) return res.status(400).json({
            message: "Missing fields"
        });
        await createRosterAnchor({
            employee_id: Number(employee_id),
            anchor_date
        });
        return res.status(201).json({
            message: "Success add roster anchor"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error add roster anchor"
        });
    }
}
async function putHandler(req, res) {
    try {
        const { employee_id, anchor_date } = req.body;
        if (!employee_id || !anchor_date) return res.status(400).json({
            message: "Missing fields"
        });
        await updateRosterAnchor({
            employee_id: Number(employee_id),
            anchor_date
        });
        return res.status(200).json({
            message: "Success update roster anchor"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error update roster anchor"
        });
    }
}
/* harmony default export */ const roster_anchor_route = ({
    postHandler,
    putHandler
});

;// CONCATENATED MODULE: ./src/pages/api/roster-anchor.ts

async function handler(req, res) {
    if (req.method === "POST") return postHandler(req, res);
    if (req.method === "PUT") return putHandler(req, res);
    res.setHeader("Allow", [
        "POST",
        "PUT"
    ]);
    res.status(405).end("Method Not Allowed");
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [188], () => (__webpack_exec__(4552)));
module.exports = __webpack_exports__;

})();