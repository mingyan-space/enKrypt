import { BrowserStorageArea } from '@enkryptcom/types'
import browser from 'webextension-polyfill'
import { StorageOptions } from './types'

class Storage {

    namespace: string

    storage: BrowserStorageArea

    constructor(namespace, options: StorageOptions = { storage: browser.storage.local }) {
        this.namespace = namespace
        this.storage = options.storage
    }

    async get(key: string) {
        const vals = await this.storage.get(this.namespace)
        if (vals[key]) return vals[key]
        return null;
    }

    async set(key: string, val: string) {
        const vals = await this.storage.get(this.namespace)
        vals[key] = val;
        return this.storage.set({
            [this.namespace]: vals
        })
    }

    async remove(key: string) {
        const vals = await this.storage.get(this.namespace)
        delete vals[key]
        return this.storage.set({
            [this.namespace]: vals
        })
    }

    async clear() {
        return this.storage.set({
            [this.namespace]: {}
        })
    }
}

export default Storage