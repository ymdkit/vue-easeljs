import assert from 'assert';
import Vue from 'vue';
import EaselBitmap from '../src/components/EaselBitmap.vue';
import isADisplayObject from './includes/is-a-display-object.js';
import isAlignable from './includes/is-alignable.js';
import canCache from './includes/can-cache.js';

describe('EaselBitmap', function () {

    describe('is a display object that', isADisplayObject(EaselBitmap, 'image="/base/test/images/gulfstream_park.jpg"'));

    describe('is cacheable and', canCache(EaselBitmap, {}, [
        {
            name: 'image',
            value: '/base/test/images/gulfstream_park.jpg',
            changeTo: '/base/test/images/lastguardian-all.png',
            shouldUpdateSameObject: true,
        },
    ]));

    describe('is alignable and', isAlignable(EaselBitmap, {width: 1500, height: 946}, 'image="/base/test/images/gulfstream_park.jpg"'));

    const buildVm = function () {
        const easel = {
            addChild(vueChild) {
            },
            removeChild(vueChild) {
            },
        };

        const vm = new Vue({
            template: `
                <span>
                    <easel-bitmap ref="bitmap"
                        v-if="showBitmap"
                        :x="1"
                        :y="2"
                        :image="image"
                        :align="align"
                    >
                    </easel-bitmap>
                </span>
            `,
            provide() {
                return {
                    easelParent: easel,
                };
            },
            data() {
                return {
                    image: '/base/test/images/gulfstream_park.jpg',
                    showBitmap: true,
                    align: 'top-left',
                };
            },
            components: {
                'easel-bitmap': EaselBitmap,
            },
        }).$mount();

        const bitmap = vm.$refs.bitmap;

        return {vm, bitmap};
    };

    it('should exist', function () {
        const {vm, bitmap} = buildVm();
        assert(bitmap);
    });

    it('should have component field', function () {
        const {vm, bitmap} = buildVm();
        assert(bitmap.component);
    });

    it('should have the right image', function () {
        const {vm, bitmap} = buildVm();
        assert(/gulfstream_park/.test(bitmap.component.image.src), 'Wrong src: ' + bitmap.component.image.src);
    });

    it('should be able to change the image', function (done) {
        const {vm, bitmap} = buildVm();
        const image = vm.image;
        vm.image = Math.random();
        Vue.nextTick()
            .then(() => {
                const qr = new RegExp(vm.image);
                assert(
                    qr.test(bitmap.component.image.src) || qr.test(bitmap.component.image),
                    'Wrong src in: ' + bitmap.component.image
                );
                vm.image = image;
                return Vue.nextTick();
            })
            .then(done, done);
    });

    it('should get dimensions', function (done) {
        const {vm, bitmap} = buildVm();
        bitmap.getAlignDimensions()
            .then(dimensions => {
                assert(dimensions.width === 1500, 'Wrong width: ' + dimensions.width);
                assert(dimensions.height === 946, 'Wrong height: ' + dimensions.height);
            })
            .then(done, done);
    });

    ['center-left', 'top-left', 'bottom-right']
        .forEach(align => {
            it('should get cache bounds (no matter the align)', function (done) {
                const {vm, bitmap} = buildVm();
                vm.align = align;
                Vue.nextTick()
                    .then(() => bitmap.getCacheBounds())
                    .then(({x, y, width, height}) => {
                        assert(x === 0, `x is wrong: ${x}`);
                        assert(y === 0, `y is wrong: ${y}`);
                        assert(width === 1500, `width is wrong: ${width}`);
                        assert(height === 946, `height is wrong: ${height}`);
                    })
                    .then(done, done);
            });
        });
});
