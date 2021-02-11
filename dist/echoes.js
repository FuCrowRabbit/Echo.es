'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory;
    } else {
        root.echo = factory(root);
    }
})(this,
    /**
     * @param {Document} root
     * @returns {Echo}
     */
    function (root) {
        var echo = {};

        var callback = function callback() {};
        /** @var {Partial<Rect>} */


        var offset;
        /** @var {number | null} */

        var poll, delay;
        /** @var {boolean | null} */

        var useDebounce, unload;
        /**
         * @param {HTMLElement} element
         * @returns {boolean}
         */

        var isHidden = function isHidden(element) {
            return element.offsetParent === null;
        };
        /**
         * @param element
         * @param {Rect} view
         * @returns {boolean}
         */


        var inView = function inView(element, view) {
            if (isHidden(element)) {
                return false;
            }

            var box = element.getBoundingClientRect();
            return box.right >= view.left && box.bottom >= view.top && box.left <= view.right && box.top <= view.bottom;
        };

        var debounceOrThrottle = function debounceOrThrottle() {
            if (!useDebounce && !!poll) {
                return;
            }

            clearTimeout(poll);
            poll = setTimeout(function () {
                echo.render();
                poll = null;
            }, delay);
        };
        /**
         * @param {EchoOption} options
         * @returns {EchoConfig}
         */


        var generateEchoConfig = function generateEchoConfig(options) {
            var optionToInt = function optionToInt(options, fallback) {
                return parseInt(options || fallback, 10);
            };

            var offsetAll = optionToInt(options.offset, 0);
            var offsetVertical = optionToInt(options.offsetVertical, offsetAll);
            var offsetHorizontal = optionToInt(options.offsetHorizontal, offsetAll);
            return {
                offset: offsetAll,
                offsetVertical: offsetVertical,
                offsetHorizontal: offsetHorizontal,
                offsetTop: optionToInt(options.offsetTop, offsetVertical),
                offsetBottom: optionToInt(options.offsetBottom, offsetVertical),
                offsetLeft: optionToInt(options.offsetLeft, offsetHorizontal),
                offsetRight: optionToInt(options.offsetRight, offsetHorizontal),
                throttle: optionToInt(options.throttle, 250),
                debounce: options.debounce !== false,
                unload: !!options.unload,
                callback: options.callback || callback
            };
        };
        /**
         * @param {EchoOption} options
         */


        echo.init = function () {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var config = generateEchoConfig(options);
            offset = {
                top: config.offsetTop,
                bottom: config.offsetBottom,
                left: config.offsetLeft,
                right: config.offsetRight
            };
            delay = config.throttle;
            useDebounce = config.debounce;
            unload = config.unload;
            callback = config.callback;
            echo.render();

            if (document.addEventListener) {
                root.addEventListener('scroll', debounceOrThrottle, false);
                root.addEventListener('load', debounceOrThrottle, false);
            } else {
                root.attachEvent('onscroll', debounceOrThrottle);
                root.attachEvent('onload', debounceOrThrottle);
            }
        };
        /**
         * @param {Partial<Element | Document>} context
         */


        echo.render = function () {
            var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var nodes = (context || document).querySelectorAll('[data-echo], [data-echo-zoo], [data-echo-background]');
            var length = nodes.length;
            var view = {
                left: 0 - offset.left,
                top: 0 - offset.top,
                bottom: (root.innerHeight || document.documentElement.clientHeight) + offset.bottom,
                right: (root.innerWidth || document.documentElement.clientWidth) + offset.right
            };
            NamedNodeMap.prototype.filter = Array.prototype.filter;
            NamedNodeMap.prototype.map = Array.prototype.map;
            nodes.forEach(function (elem) {
                var src;
                var remove_queue = [];

                if (inView(elem, view)) {
                    if (unload) {
                        elem.setAttribute('data-echo-placeholder', elem.src);
                        elem.attributes.map(function (attribute) {
                            return attribute.name.match(/data-echo-zoo-(.+)/);
                        }).filter(function (value) {
                            return Array.isArray(value) && value[1] !== undefined;
                        }).forEach(function (attribute) {
                            if (!elem.hasAttribute("data-echo-placeholder-zoo-".concat(attribute[1]))) elem.setAttribute("data-echo-placeholder-zoo-".concat(attribute[1]), elem.getAttribute(attribute[1]));
                        });
                    }

                    if (elem.getAttribute('data-echo-background') !== null) {
                        elem.style.backgroundImage = 'url(' + elem.getAttribute('data-echo-background') + ')';
                    } else if (elem instanceof HTMLImageElement && elem.src !== (src = elem.getAttribute('data-echo'))) {
                        elem.src = src;
                    }

                    elem.attributes.map(function (attribute) {
                        return attribute.name.match(/data-echo-zoo-(.+)/);
                    }).filter(function (value) {
                        return Array.isArray(value) && value[1] !== undefined;
                    }).forEach(function (attribute) {
                        elem.setAttribute(attribute[1], elem.getAttribute("data-echo-zoo-".concat(attribute[1])));
                        remove_queue.push("data-echo-zoo-".concat(attribute[1]));
                    });

                    if (!unload) {
                        elem.removeAttribute('data-echo');
                        elem.removeAttribute('data-echo-background');
                        elem.removeAttribute('data-echo-zoo');
                        remove_queue.forEach(function (name) {
                            return elem.removeAttribute(name);
                        });
                    }

                    callback(elem, 'load');
                } else if (unload) {
                    var exec = false;

                    if (!!(src = elem.getAttribute('data-echo-placeholder'))) {
                        if (elem.getAttribute('data-echo-background') !== null) {
                            elem.style.backgroundImage = 'url(' + src + ')';
                        } else {
                            elem.src = src;
                        }

                        elem.removeAttribute('data-echo-placeholder');
                        exec = true;
                    }

                    elem.attributes.map(function (attribute) {
                        return attribute.name.match(/data-echo-placeholder-zoo-(.+)/);
                    }).filter(function (value) {
                        return Array.isArray(value) && value[1] !== undefined;
                    }).forEach(function (attribute) {
                        elem.setAttribute(attribute[1], elem.getAttribute("data-echo-placeholder-zoo-".concat(attribute[1])));
                        elem.removeAttribute("data-echo-placeholder-zoo-".concat(attribute[1]));
                        exec = true;
                    });
                    if (exec) callback(elem, 'unload');
                }
            });

            if (!length) {
                echo.detach();
            }
        };

        echo.detach = function () {
            if (document.removeEventListener) {
                root.removeEventListener('scroll', debounceOrThrottle);
            } else {
                root.detachEvent('onscroll', debounceOrThrottle);
            }

            clearTimeout(poll);
        };

        return echo;
    });