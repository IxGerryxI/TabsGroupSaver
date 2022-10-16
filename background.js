import { TabGroup } from "./js/classes/classes.js"
import Storage from "./js/api/sync-storage.js"
import { onTabCreated, onTabGroupCreated, onTabGroupUpdated, onTabRemoved, onTabUpdated } from "./js/listeners.js"
import { statuses, setIconStatus } from "./js/icon-status.js";
import Tabgroups from "./js/api/tabgroups.js";

// add tabgroup listeners
chrome.tabGroups.onCreated.addListener(onTabGroupCreated);
chrome.tabGroups.onUpdated.addListener(onTabGroupUpdated);

//add tabs listeners
chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onRemoved.addListener(onTabRemoved);
chrome.tabs.onUpdated.addListener(onTabUpdated);

/**
 * updates the stored tabGroups
 */
async function updateStoredTabGroups() {
    //get all the Tabgroups that are already in Storage
    const storedTabGroups = (await Storage.list()).map(item => new TabGroup(item));

    //get all the currently active Tabgroups
    const tabgroups = await Tabgroups.list();

    //compare current and stored Tabgroups and update the stored ones
    for (const tabGroup of tabgroups) {
        let storedTabGroup = storedTabGroups.find(group => group.id == tabGroup.id);

        if (!storedTabGroup) {//Tabgroup doesnt exist so create a new one
            storedTabGroup = new TabGroup(tabGroup);
            storedTabGroups.push(storedTabGroup);
        } else if (storedTabGroup.active) {//Tabgroup exists so make sure it is uptodate
            storedTabGroup.update(tabGroup);
        }
    }

    Storage.saveList(storedTabGroups, 'id')
    setIconStatus(statuses.LOADED)
}


updateStoredTabGroups()