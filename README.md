# Echo.es

Echo is standalone JavaScript lazy-loading image micro-library.

Echo.es is based on [Echo.js v1.7.2](https://github.com/toddmotto/echo) from "Todd Motto".

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
        offset: 100,
        throttle: 250,
        unload: false,
        callback: function (element, op) {
            console.log(element, 'has been', op + 'ed')
        }
    });

    // echo.render(); is also available for non-scroll callbacks
</script>
</body>
```

## Features

You should see [Echo.js](https://github.com/toddmotto/echo).

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
