/*
|--------------------------------------------------------------------------
| EaselDisplayObject
|--------------------------------------------------------------------------
|
| This mixin gives an Easel Vue component the required elements to be 
| visible on the canvas.
|
*/

import EaselEventBinder from '../EaselEventBinder.js';

module.exports = {
    inject: ['easel'],
    props: ['x', 'y', 'flip', 'rotation', 'scale'],
    data() {
        return {
            component: null,
        };
    },
    watch: {
        x() {
            this.component.x = this.x;
        },
        y() {
            this.component.y = this.y;
        },
        flip() {
            this.updateScales();
        },
        scale() {
            this.updateScales();
        },
        rotation() {
            this.component.rotation = this.rotation;
        },
        'easel.stage': function () {
            this.init();
        },
    },
    mounted() {
        if (this.easel.stage) {
            this.init();
        }
    },
    destroyed() {
        if (this.easel.stage) {
            this.displayObjectBreakdown();
        }
    },
    methods: {
        displayObjectInit() {
            EaselEventBinder.bindEvents(this, this.component);
            this.component.x = this.x;
            this.component.y = this.y;
            this.component.rotation = this.rotation;
            this.updateScales();
            this.easel.stage.addChild(this.component);
        },
        displayObjectBreakdown() {
            this.easel.stage.removeChild(this.component);
        },
        updateScales() {
            if (this.component) {
                this.component.scaleX = this.flip === 'horizontal' || this.flip === 'both' ? -this.scale : this.scale;
                this.component.scaleY = this.flip === 'vertical' || this.flip === 'both' ? -this.scale : this.scale;
            }
        },
    },
};
