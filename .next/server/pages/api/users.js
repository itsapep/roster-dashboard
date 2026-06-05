"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/users";
exports.ids = ["pages/api/users"];
exports.modules = {

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "drizzle-orm/node-postgres":
/*!********************************************!*\
  !*** external "drizzle-orm/node-postgres" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("drizzle-orm/node-postgres");

/***/ }),

/***/ "drizzle-orm/pg-core":
/*!**************************************!*\
  !*** external "drizzle-orm/pg-core" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("drizzle-orm/pg-core");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "(api)/./src/db/index.ts":
/*!*************************!*\
  !*** ./src/db/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   db: () => (/* binding */ db)\n/* harmony export */ });\n/* harmony import */ var drizzle_orm_node_postgres__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! drizzle-orm/node-postgres */ \"drizzle-orm/node-postgres\");\n/* harmony import */ var drizzle_orm_node_postgres__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(drizzle_orm_node_postgres__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_2___default().config();\nconst pool = new pg__WEBPACK_IMPORTED_MODULE_1__.Pool({\n    connectionString: process.env.DATABASE_URL\n});\nconst db = (0,drizzle_orm_node_postgres__WEBPACK_IMPORTED_MODULE_0__.drizzle)(pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvZGIvaW5kZXgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFtRDtBQUMxQjtBQUNFO0FBRTNCRSxvREFBYTtBQUViLE1BQU1FLE9BQU8sSUFBSUgsb0NBQUlBLENBQUM7SUFBRUksa0JBQWtCQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7QUFBQztBQUM1RCxNQUFNQyxLQUFLVCxrRUFBT0EsQ0FBQ0ksTUFBSyIsInNvdXJjZXMiOlsid2VicGFjazovL3Jvc3Rlci1kYXNoYm9hcmQvLi9zcmMvZGIvaW5kZXgudHM/ZGFjNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkcml6emxlIH0gZnJvbSAnZHJpenpsZS1vcm0vbm9kZS1wb3N0Z3JlcydcbmltcG9ydCB7IFBvb2wgfSBmcm9tICdwZydcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52J1xuXG5kb3RlbnYuY29uZmlnKClcblxuY29uc3QgcG9vbCA9IG5ldyBQb29sKHsgY29ubmVjdGlvblN0cmluZzogcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMIH0pXG5leHBvcnQgY29uc3QgZGIgPSBkcml6emxlKHBvb2wpXG4iXSwibmFtZXMiOlsiZHJpenpsZSIsIlBvb2wiLCJkb3RlbnYiLCJjb25maWciLCJwb29sIiwiY29ubmVjdGlvblN0cmluZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJkYiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/db/index.ts\n");

/***/ }),

/***/ "(api)/./src/db/schema.ts":
/*!**************************!*\
  !*** ./src/db/schema.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   users: () => (/* binding */ users)\n/* harmony export */ });\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! drizzle-orm/pg-core */ \"drizzle-orm/pg-core\");\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_0__);\n\nconst users = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_0__.pgTable)(\"users\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_0__.serial)(\"id\").primaryKey(),\n    name: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_0__.text)(\"name\")\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvZGIvc2NoZW1hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyRDtBQUVwRCxNQUFNRyxRQUFRSCw0REFBT0EsQ0FBQyxTQUFTO0lBQ3BDSSxJQUFJSCwyREFBTUEsQ0FBQyxNQUFNSSxVQUFVO0lBQzNCQyxNQUFNSix5REFBSUEsQ0FBQztBQUNiLEdBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb3N0ZXItZGFzaGJvYXJkLy4vc3JjL2RiL3NjaGVtYS50cz9mMDE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHBnVGFibGUsIHNlcmlhbCwgdGV4dCB9IGZyb20gJ2RyaXp6bGUtb3JtL3BnLWNvcmUnXG5cbmV4cG9ydCBjb25zdCB1c2VycyA9IHBnVGFibGUoJ3VzZXJzJywge1xuICBpZDogc2VyaWFsKCdpZCcpLnByaW1hcnlLZXkoKSxcbiAgbmFtZTogdGV4dCgnbmFtZScpLFxufSlcbiJdLCJuYW1lcyI6WyJwZ1RhYmxlIiwic2VyaWFsIiwidGV4dCIsInVzZXJzIiwiaWQiLCJwcmltYXJ5S2V5IiwibmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/db/schema.ts\n");

/***/ }),

/***/ "(api)/./src/pages/api/users.ts":
/*!********************************!*\
  !*** ./src/pages/api/users.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../db */ \"(api)/./src/db/index.ts\");\n/* harmony import */ var _db_schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../db/schema */ \"(api)/./src/db/schema.ts\");\n\n\nasync function handler(req, res) {\n    try {\n        const result = await _db__WEBPACK_IMPORTED_MODULE_0__.db.select().from(_db_schema__WEBPACK_IMPORTED_MODULE_1__.users).limit(10);\n        res.status(200).json(result);\n    } catch (err) {\n        console.error(err);\n        res.status(500).json({\n            error: \"DB error\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3VzZXJzLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM2QjtBQUNVO0FBRXhCLGVBQWVFLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CO0lBQzdFLElBQUk7UUFDRixNQUFNQyxTQUFTLE1BQU1MLG1DQUFFQSxDQUFDTSxNQUFNLEdBQUdDLElBQUksQ0FBQ04sNkNBQUtBLEVBQUVPLEtBQUssQ0FBQztRQUNuREosSUFBSUssTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQ0w7SUFDdkIsRUFBRSxPQUFPTSxLQUFLO1FBQ1pDLFFBQVFDLEtBQUssQ0FBQ0Y7UUFDZFAsSUFBSUssTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFRyxPQUFPO1FBQVc7SUFDM0M7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3Jvc3Rlci1kYXNoYm9hcmQvLi9zcmMvcGFnZXMvYXBpL3VzZXJzLnRzPzE0YzIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCdcbmltcG9ydCB7IGRiIH0gZnJvbSAnLi4vLi4vZGInXG5pbXBvcnQgeyB1c2VycyB9IGZyb20gJy4uLy4uL2RiL3NjaGVtYSdcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLnNlbGVjdCgpLmZyb20odXNlcnMpLmxpbWl0KDEwKVxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3VsdClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0RCIGVycm9yJyB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiZGIiLCJ1c2VycyIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJyZXN1bHQiLCJzZWxlY3QiLCJmcm9tIiwibGltaXQiLCJzdGF0dXMiLCJqc29uIiwiZXJyIiwiY29uc29sZSIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/users.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/users.ts"));
module.exports = __webpack_exports__;

})();