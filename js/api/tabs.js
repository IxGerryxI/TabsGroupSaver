export default {
    /**
     * gets a single tabgroup by its id
     * https://developer.chrome.com/docs/extensions/reference/tabs/#method-get
     * @param {Number} id 
     * @returns {Promise}
     */
    async get(id) {
        const tab = chrome.tabs.get(id)
        return tab;
    },
    /**
     * queries the tabs
     * https://developer.chrome.com/docs/extensions/reference/tabs/#method-query
     * @param {Object} queryInfo
     * @returns {Promise<Array<Object>>}
     */
    async query(queryInfo = {}) {
        const tabs = await chrome.tabs.query(queryInfo);
        return tabs
    },

    /**
     * lists all the tabps
     * @returns {Promise<Array<Object>>}
     */
    async list() {
        const tabs = await this.query();
        return tabs;
    }
}