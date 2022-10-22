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
     * @param {String} [keyColumn] - if not set the index will be taken
     */
    saveList(list, keyColumn) {
        list.forEach((item, index) => {
            const key = keyColumn ? item[keyColumn] : index;
            this.set(key || index, item)
        });
    },
    /**
     * gets a single key
     * https://developer.chrome.com/docs/extensions/reference/storage/#usage
     * @param {String} key 
     * @returns {Promise}
     */
    async get(key) {
        if (typeof key == 'number') key = key.toString();
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
        console.log('save: ', key, ' - ', item, '\n', new Error().stack)
        return chrome.storage.sync.set({ [key]: item })
    },
    /**
     * removes a single key from the storage
     * https://developer.chrome.com/docs/extensions/reference/storage/
     * @param {String} key
     * @returns {Promise}
     */
    remove(key) {
        console.log('remove: ', key, '\n', new Error().stack)
        if (typeof key == 'number') key = key.toString();
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