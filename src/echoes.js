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

       /**
        * @param {EchoOption} options
        * @returns {EchoConfig}
        */
       const generateEchoConfig = function (options) {
           return {
               root:       options.root instanceof Element || options.root instanceof Document ? options.root : null,
               rootMargin: typeof options.rootMargin === 'string' ? options.rootMargin : null,
               threshold:  typeof options.threshold === 'number' || Array.isArray(options.threshold) ? options.threshold : null,
               unload:     !!options.unload,
               callback:   typeof options.callback === 'function' ? options.callback : () => {
               },
           };
       };

       /**
        * @param o {Object}
        * @return {Object}
        */
       const deleteEmptyParams = o => {
           Object.entries(o).forEach(([key, value]) => (value === null || value === undefined || value === '' ? delete o[key] : null));
           return o;
       }

       /**
        * @param {EchoOption} options
        */
       echo.init = function (options = {}) {
           if (options.offset !== undefined) console.warn('EchoOption.offset was deleted options.');
           if (options.offsetTop !== undefined) console.warn('EchoOption.offsetTop was deleted options.');
           if (options.offsetBottom !== undefined) console.warn('EchoOption.offsetBottom was deleted options.');
           if (options.offsetLeft !== undefined) console.warn('EchoOption.offsetLeft was deleted options.');
           if (options.offsetRight !== undefined) console.warn('EchoOption.offsetRight was deleted options.');
           if (options.throttle !== undefined) console.warn('EchoOption.throttle was deleted options.');
           if (options.debounce !== undefined) console.warn('EchoOption.debounce was deleted options.');
           const config               = generateEchoConfig(options);
           const unload               = config.unload;
           const callback             = config.callback;
           const nodes                = document.querySelectorAll('[data-echo], [data-echo-zoo], [data-echo-background]');
           const intersectionObserver = new IntersectionObserver(function (entries) {
               entries.forEach(function (entry) {
                   let src;
                   let removeQueue = [];
                   const elem       = entry.target;
                   if (entry.isIntersecting) {
                       if (unload) {
                           elem.setAttribute('data-echo-placeholder', elem.src);

                           [...elem.attributes].map((attribute) => attribute.name.match(/data-echo-zoo-(.+)/)).filter((value) => Array.isArray(value) && value[1] !== undefined).forEach((attribute) => {
                               const value = elem.getAttribute(attribute[1]);
                               if (!elem.hasAttribute(`data-echo-placeholder-zoo-${attribute[1]}`) && value !== null) elem.setAttribute(`data-echo-placeholder-zoo-${attribute[1]}`, value);
                           });
                       }

                       if (elem.getAttribute('data-echo-background') !== null) {
                           elem.style.backgroundImage = `url(${elem.getAttribute('data-echo-background')})`;
                       } else if (elem instanceof HTMLImageElement && elem.src !== (src = elem.getAttribute('data-echo'))) {
                           elem.src = src;
                       }

                       [...elem.attributes].map((attribute) => attribute.name.match(/data-echo-zoo-(.+)/)).filter((value) => Array.isArray(value) && value[1] !== undefined).forEach((attribute) => {
                           elem.setAttribute(attribute[1], elem.getAttribute(`data-echo-zoo-${attribute[1]}`));
                           removeQueue.push(`data-echo-zoo-${attribute[1]}`);
                       });

                       if (!unload) {
                           elem.removeAttribute('data-echo');
                           elem.removeAttribute('data-echo-background');
                           elem.removeAttribute('data-echo-zoo');
                           removeQueue.forEach((name) => elem.removeAttribute(name));
                       }

                       callback(entry, 'load');
                   } else {
                       let exec = false;
                       if (!!(src = elem.getAttribute('data-echo-placeholder'))) {
                           if (elem.getAttribute('data-echo-background') !== null) {
                               elem.style.backgroundImage = `url(${src})`;
                           } else {
                               elem.src = src;
                           }
                           elem.removeAttribute('data-echo-placeholder');
                           exec = true;
                       }

                       [...elem.attributes].map((attribute) => attribute.name.match(/data-echo-placeholder-zoo-(.+)/)).filter((value) => Array.isArray(value) && value[1] !== undefined).forEach((attribute) => {
                           elem.setAttribute(attribute[1], elem.getAttribute(`data-echo-placeholder-zoo-${attribute[1]}`));
                           elem.removeAttribute(`data-echo-placeholder-zoo-${attribute[1]}`);
                           exec = true;
                       });
                       if (exec) callback(entry, 'unload');
                   }
               });
           }, deleteEmptyParams({
                                    root:       config.root,
                                    rootMargin: config.rootMargin,
                                    threshold:  config.threshold,
                                }));
           [...nodes].forEach(function (elem) {
               intersectionObserver.observe(elem);
           });
       };

       return echo;

   });
