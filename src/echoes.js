'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
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

        const echo = {};

        let callback = () => {
        };

        /** @var {Partial<Rect>} */
        let offset;
        /** @var {number | null} */
        let poll, delay;
        /** @var {boolean | null} */
        let useDebounce, unload;

        /**
         * @param {HTMLElement} element
         * @returns {boolean}
         */
        const isHidden = function (element) {
            return (element.offsetParent === null);
        };

        /**
         * @param element
         * @param {Rect} view
         * @returns {boolean}
         */
        const inView = function (element, view) {
            if (isHidden(element)) {
                return false;
            }

            const box = element.getBoundingClientRect();
            return (box.right >= view.left && box.bottom >= view.top && box.left <= view.right && box.top <= view.bottom);
        };

        const debounceOrThrottle = function () {
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
        const generateEchoConfig = function (options) {
            const optionToInt = (options, fallback) => parseInt(options || fallback, 10);
            const offsetAll = optionToInt(options.offset, 0);
            const offsetVertical = optionToInt(options.offsetVertical, offsetAll);
            const offsetHorizontal = optionToInt(options.offsetHorizontal, offsetAll);
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
                callback: options.callback || callback,
            };
        };

        /**
         * @param {EchoOption} options
         */
        echo.init = function (options = {}) {
            const config = generateEchoConfig(options);
            offset = {
                top: config.offsetTop,
                bottom: config.offsetBottom,
                left: config.offsetLeft,
                right: config.offsetRight,
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
        echo.render = function (context= null) {
            const nodes = (context || document).querySelectorAll('[data-echo], [data-echo-zoo], [data-echo-background]');
            const length = nodes.length;
            const view = {
                left: 0 - offset.left,
                top: 0 - offset.top,
                bottom: (root.innerHeight || document.documentElement.clientHeight) + offset.bottom,
                right: (root.innerWidth || document.documentElement.clientWidth) + offset.right
            };
            NamedNodeMap.prototype.filter = Array.prototype.filter;
            NamedNodeMap.prototype.map = Array.prototype.map;
            nodes.forEach(function (elem) {
                let src;
                let remove_queue = [];
                if (inView(elem, view)) {

                    if (unload) {
                        elem.setAttribute('data-echo-placeholder', elem.src);
                    }

                    if (elem.getAttribute('data-echo-background') !== null) {
                        elem.style.backgroundImage = 'url(' + elem.getAttribute('data-echo-background') + ')';
                    } else if (elem instanceof HTMLImageElement && elem.src !== (src = elem.getAttribute('data-echo'))) {
                        elem.src = src;
                    }

                    elem.attributes.map((attribute) => attribute.name.match(/data-echo-zoo-(.+)/)).filter((value) => Array.isArray(value) && value[1] !== undefined).forEach((attribute) => {
                        elem.setAttribute(attribute[1], elem.getAttribute(`data-echo-zoo-${attribute[1]}`));
                        remove_queue.push(`data-echo-zoo-${attribute[1]}`);
                    });

                    if (!unload) {
                        elem.removeAttribute('data-echo');
                        elem.removeAttribute('data-echo-background');
                        elem.removeAttribute('data-echo-zoo');
                        remove_queue.forEach((name) => elem.removeAttribute(name));
                    }

                    callback(elem, 'load');
                } else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {

                    if (elem.getAttribute('data-echo-background') !== null) {
                        elem.style.backgroundImage = 'url(' + src + ')';
                    } else {
                        elem.src = src;
                    }

                    elem.removeAttribute('data-echo-placeholder');
                    callback(elem, 'unload');
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
