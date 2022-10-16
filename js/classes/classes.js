export class TabGroup {

    constructor(group) {
        //chrome properties
        this.id = group.id;
        this.title = group.title;
        this.color = group.color;
        this.collapsed = group.collapsed;
        this.windowId = group.windowId;
        this.tabs = group.tabs?.map(tab => new Tab(tab)) || [];
        //TabsGroupSaver properties
        this.active = group.active || true;
    }

    /**
     * updates the Object with the given field
     * @param {Object} fields 
     */
    update(fields) {
        const forbiddenKeys = ["id"]; //some keys are forbidden to be updated
        Object.entries(fields).forEach(([key, value]) => !forbiddenKeys.includes(key) ? this[key] = value : "");
        return this;
    }
}

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