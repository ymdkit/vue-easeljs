<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import easeljs from '../../easeljs/easel.js';
import EaselDisplayObject from '../mixins/EaselDisplayObject.js';
import EaselParent from '../mixins/EaselParent.js';
import EaselCache from '../mixins/EaselCache.js';
import EaselFilter from '../mixins/EaselFilter.js';

export default {
    props: ['regX','regY'],
    mixins: [EaselDisplayObject, EaselParent, EaselCache, EaselFilter],
    updatesEaselCache: ['children', 'scale'],
    mounted() {
        this.component = new easeljs.Container();
        this.component.regX = this.regX;
        this.component.regY = this.regY;
    },
    watch: {
        regX() {
            this.component.regX = this.regX;
        },
        regY() {
            this.component.regY = this.regY;
        }
    },
    methods: {
        getCacheBounds() {
            return Promise.all(
                    this.children
                        .map(component => {
                            return component.getRelativeCacheBounds
                                ? component.getRelativeCacheBounds()
                                : Promise.reject(`<${component.$options.name}> does not mixin EaselCache`);
                        })
                )
                .then(allBounds => {
                    return allBounds.reduce(
                        this.getSmallestCombination,
                        {x: 0, y: 0, width: 1, height: 1}
                    );
                });
        },
    },
};
</script>
