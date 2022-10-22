import TabGroups from '../api/tabgroups.js';
import Tabs from "../api/tabs.js";
/**
 * 
 */
export class TabGroup {

    constructor(group) {
        this.update(group);
    }

    /**
     * updates the group
     * @param {Object} group
     * @returns {Object} - this instance for chaining
     */
    update(group) {
        //chrome properties
        this.id = group.id;
        this.title = group.title;
        this.color = group.color;
        this.collapsed = group.collapsed;
        this.windowId = group.windowId;
        //TabsGroupSaver properties
        this.tabs = group.tabs?.map(tab => new Tab(tab)) || [];
        this.active = group.active || true; //the user should be able to have tabgroups as active meaning they will be synced other than that the tab group will be ignored
        //active should be set to true with every update because if the user set the group inactive, it shouldn't be updated in the first place
    }

    /**
     * patch the Object with the given field
     * @param {Object} fields 
     * @returns {Object} - this instance for chaining
     */
    patch(fields) {
        Object.entries(fields).forEach(([key, value]) => this[key] = value);
        return this;
    }

    /**
     * activates the syncing of the tabgroup
     */
    async activate() {
        this.active = true;
        const tabGroup = await TabGroups.get(this.id);
        const tabs = await Tabs.query({ groupId: tabGroup.id });
        tabGroup.tabs = tabs;

        this.update(tabGroup);
    }

    /**
     * deactivates the syncing of the tabgroup
     * except for the title
     */
    deactivate() {
        this.active = false;
        delete this.tabs;
        delete this.color;
        delete this.collapsed;
        delete this.windowId;
    }

}

/**
 * 
 */
export class Tab {

    constructor(tab) {
        this.update(tab);
    }

    update(tab) {
        this.id = tab.id;
        this.groupId = tab.groupId;
        this.favIconUrl = tab.favIconUrl;
        this.title = tab.title;
        this.url = tab.url;
    }
}