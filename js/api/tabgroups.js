import Tabs from './tabs.js'

export default {
    /**
     * gets a single tabgroup by its id
     * https://developer.chrome.com/docs/extensions/reference/tabGroups/#method-get
     * @param {Number} id 
     * @returns {Promise}
     */
    async get(id) {
        const tabgroup = chrome.tabGroups.get(id)
        return tabgroup;
    },
    /**
     * queries the tabgroups
     * https://developer.chrome.com/docs/extensions/reference/tabGroups/#method-query
     * @param {Object} queryInfo 
     * @returns {}
     */
    async query(queryInfo = {}) {
        const tabGroups = await chrome.tabGroups.query(queryInfo);
        return tabGroups;
    },
    /**
     * lists all the tabgroups
     */
    async list() {
        // const tabGroups = await this.query();

        //NOTE: for some reason querying the tabsgroup api without query properties does not 
        //return all tabgroups like the documentation says but throws a error, so the tabgroups 
        //will be called individually from all the tabs that exist

        const tabs = await Tabs.list();
        const tabGroupIds = [...new Set(tabs.map(tab => tab.groupId).filter(id => id > 0))];
        const tabGroups = await Promise.all(tabGroupIds.map(async id => (this.get(id))));
        return tabGroups;
    }
}