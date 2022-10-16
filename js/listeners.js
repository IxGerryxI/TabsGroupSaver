import { Tab, TabGroup } from "./classes/classes.js"
import Storage from "./api/sync-storage.js"
import Tabs from "./api/tabs.js"

/*******************************************************
 ********************** TABGROUPS **********************
 *******************************************************/
/**
 * what is supposed to happen when a group gets created
 * @param {Object} group 
 */
export function onTabGroupCreated(group) {
    group = new TabGroup(group);
    Storage.set(group.id, group);
    console.log('onCreated: ', group)
}

/**
 * what is supposed to happen when a group gets updated
 * @param {Object} group 
 */
export async function onTabGroupUpdated(group) {
    const storedGroup = new TabGroup(await Storage.get(group.id.toString()));
    storedGroup.update(group);
    Storage.set(storedGroup.id, storedGroup);
    console.log('onUpdated: ', group)
}

/*******************************************************
 ************************ TABS *************************
 *******************************************************/
/**
 * what happens when a tab is created
 * @param {*} tab 
 */
export async function onTabCreated(createdtab) {
    //if Tab has a Tabgroup create the Tab and add it to the Tabgroup
    if (!tab.groupId) return;

    console.log('created: \n', createdtab);

    const tab = new Tab(createdtab);

    //get the tabgroup
    const tabgroup = Storage.get(createdtab.groupId);
    tabgroup.tabs.push(tab);
    Storage.set(createdtab.groupId, tabgroup);
}

/**
 * what happens when a tab is removed
 * @param {String} tabId 
 * @param {Object} removeInfo 
 */
export async function onTabRemoved(tabId, removeInfo) {
    if (removeInfo.isWindowClosing) return; //if the window is closing, the tab will remain in the stored tabgroup

    console.log('removed: \n', tabId, removeInfo);

    //window is not closing so remove the tab from the tabgroup if it is in one
    const tab = Tabs.get(tabId);

    if (!tab.groupId) return //nothing to do if there is no groupId

    //get the tabgroup
    const tabgroup = Storage.get(tab.groupId);
    //remove the tab
    tabgroup.tabs = tabgroup.tabs.filter(t => t.id != tabId);
    //save the tabgroup
    Storage.set(tab.groupId, tabgroup);

}

/**
 * what happens when a tab is updated
 * @param {String} tabId 
 * @param {Object} changeInfo 
 */
export async function onTabUpdated(tabId, changeInfo, tab) {
    //if there is no groupId on the tab and the groupId hasn't been changed, there is nothing todo
    if (!tab.groupId && !changeInfo.groupId) return

    console.log('updated: \n', tabId, changeInfo, tab);
    //find the tap via the groupId
    //update the tab inside the tabgroup
    //save the updated tab group
}