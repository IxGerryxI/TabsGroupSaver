export default {
    /**
     * lists all items in storage
     * @returns {Array<Object>}
     */
    async list() {
        const items = await this.get(null);
        const list = Object.keys(items).map(key => items[key]);
        return list
    },
    /**
     * saves the given list
     * @param {Array<Object>} list 
     * @param {String} [key] - if not set the index will be taken
     */
    saveList(list, key) {
        list.forEach((item, index) => this.set(key || index, item));
    },
    /**
     * gets a single key
     * https://developer.chrome.com/docs/extensions/reference/storage/#usage
     * @param {String} key 
     * @returns {Promise}
     */
    get(key) {
        return chrome.storage.sync.get(key)
    },
    /**
     * sets a single key
     * https://developer.chrome.com/docs/extensions/reference/storage/#usage
     * @param {String} key 
     * @param {*} item 
     * @returns {Promise}
     */
    set(key, item) {
        return chrome.storage.sync.set({ [key]: item })
    },
    /**
     * removes a single key from the storage
     * https://developer.chrome.com/docs/extensions/reference/storage/
     * @param {String} key
     * @returns {Promise}
     */
    remove(key) {
        return chrome.storage.sync.remove(key);
    },
    /**
     * clears all the key from the storage
     * @returns {Promise}
     */
    clear() {
        return chrome.storage.sync.clear();
    }
}