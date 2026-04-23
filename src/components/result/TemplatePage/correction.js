import Vue from 'vue'
import { Icon } from 'vant'

/**
 * 展示纠错词
 * @param {string} originWord 原搜索词
 * @param {string} correctionWord 纠错词
 * @param {function} callBack 点击纠错词回调
 * @returns mount
 */
class Correction {
    #el
    constructor(originWord, correctionWord, callBack) {
        const correctionInstance = Vue.extend({
            render: (h) => {
                return h('div', { attrs: { id: 'correction_container' } }, [
                    h(Icon, { props: { name: 'info' } }),
                    h('span', {}, '已为您显示'),
                    h('span', { attrs: { class: 'word' } }, `“${correctionWord}”`),
                    h('span', {}, '相关的结果，仍然搜索：'),
                    h('u', { attrs: { class: 'word' }, on: { click: this.clickHandle(callBack) } }, originWord)
                ])
            }
        })
        console.log('new correctionInstance().$mount().$el')
        console.log(new correctionInstance().$mount().$el)
        this.#el = new correctionInstance().$mount().$el
    }
    static clearCorrection() {
        const correctionDom = document.getElementById('correction_container')
        correctionDom && correctionDom.parentNode.removeChild(correctionDom)
    }
    clickHandle(callBack) {
        return () => {
            this.constructor.clearCorrection()
            callBack()
        }
    }
    /**
     * 挂载
     * @param {element} container 挂载节点
     */
    mount(container) {
        Vue.nextTick(() => {
            this.constructor.clearCorrection()
            console.log(this.#el)
            container.insertBefore(this.#el, container.firstChild)
        })
    }
}

export default Correction