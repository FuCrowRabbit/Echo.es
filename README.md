# Echo.es v2

Echo is standalone JavaScript lazy-loading image micro-library.

Echo.es is based on [Echo.js v1.7.2](https://github.com/toddmotto/echo) from "Todd Motto".

Echo.es (v2 or higher) use Intersection Observer API.

```html
<body>

<picture>
    <source srcset="img/blank.gif" data-echo-zoo data-echo-zoo-srcset="img/photo-320.jpg" data-echo-zoo-media="(min-width: 320px)">
    <img src="img/blank.gif" data-echo="img/photo.jpg" alt="loading" data-echo-zoo-alt="Photo">
</picture>

<img src="img/blank.gif" data-echo="img/photo.jpg" data-echo-zoo-srcset="img/photo-320.jpg 320w" alt="loading" data-echo-zoo-alt="Photo">

<script src="dist/echoes.js"></script>
<script>
    echo.init({
        rootMargin: '10px 10px',
        threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9 ,1.0],
        unload: false,
        callback: function (entry, op) {
            console.log(entry, 'has been', op + 'ed')
        }
    });
</script>
</body>
```

## Features

You should see [Echo.js](https://github.com/toddmotto/echo).

### .init() (options)

The `init()` API takes a few options

#### root
Type: `Element|Document`

https://w3c.github.io/IntersectionObserver/#dom-intersectionobserver-root

#### rootMargin
Type: `String`

https://w3c.github.io/IntersectionObserver/#dom-intersectionobserver-rootmargin

#### threshold
Type: `Number|Array<Number>`

https://w3c.github.io/IntersectionObserver/#dom-intersectionobserver-thresholds

#### unload
Type: `Boolean` Default: `false`

This option will tell echo to unload loaded images once they have scrolled beyond the viewport (including the offset area).

#### callback
Type: `(entry: IntersectionObserverEntry, operation: 'load' | 'unload') => void`

The callback will be passed the element that has been updated and what the update operation was (ie `load` or `unload`). This can be useful if you want to add a class like `loaded` to the element. Or do some logging.

```js
echo.init({
    callback: function (entry, op) {
        if (op === 'load') {
          entry.target.classList.add('loaded');
        } else {
          entry.target.classList.remove('loaded');
        }
    }
});
```

### Added from Echo.es

#### data-echo-zoo (HTML Attribute)
Require it if element using lazy-load has neither `data-echo` nor `data-echo-background`.

#### data-echo-zoo-* (HTML Attribute)
Add or replace attributes when lazy-loading.

ex.
```html
<!-- before lazy-load -->
<img src="img/blank.gif" data-echo="img/photo.jpg" alt="loading" data-echo-zoo-alt="Photo">

<!-- after lazy-load -->
<img src="img/photo.jpg" alt="Photo">
```

Doing this, become able to lazy-loading of responsive image.

ex.
```html
<!-- before lazy-load -->
<img src="img/blank.gif" data-echo="img/photo.jpg" data-echo-zoo-srcset="img/photo-320.jpg 320w" alt="loading" data-echo-zoo-alt="Photo">

<!-- after lazy-load -->
<img src="img/photo.jpg" srcset="img/photo-320.jpg 320w" alt="Photo">
```

## License

MIT license
