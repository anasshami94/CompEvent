"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConstants = exports.getConstants = exports.setToken = exports.getToken = void 0;

var _asyncStorage = _interopRequireDefault(require("@react-native-community/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getToken = function getToken() {
  var value;
  return regeneratorRuntime.async(function getToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('@auth_token'));

        case 3:
          value = _context.sent;

          if (!(value !== null)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", value);

        case 6:
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", null);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getToken = getToken;

var setToken = function setToken(token) {
  return regeneratorRuntime.async(function setToken$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('@auth_token', token));

        case 3:
          _context2.next = 8;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", null);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.setToken = setToken;

var getConstants = function getConstants(constants) {
  var value;
  return regeneratorRuntime.async(function getConstants$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('@constants'));

        case 3:
          value = _context3.sent;

          if (!(value !== null)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", value);

        case 6:
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", null);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getConstants = getConstants;

var setConstants = function setConstants(constants) {
  return regeneratorRuntime.async(function setConstants$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('@constants', constants));

        case 3:
          _context4.next = 8;
          break;

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", null);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.setConstants = setConstants;