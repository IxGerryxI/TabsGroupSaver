import { Tab, TabGroup } from "./classes/classes.js"
import Storage from "./api/sync-storage.js"
/*******************************************************
 ********************** TABGROUPS **********************
 *******************************************************/
/**
 * what is supposed to happen when a group gets created
 * @param {Object} group 
 */
export function onTabGroupCreated(group) {
    // console.log('onCreated: ', group)
    group = new TabGroup(group);
    console.log(group)
    Storage.set(group.id, group);
}

/**
 * what is supposed to happen when a group gets removed
 * @param {Object} group 
 */
export async function onTabGroupRemoved(group) {
    console.log('onTabGroupRemoved(%o)', group)
    const storedGroup = (await Storage.get(group.id))[group.id];
    console.log('onTabGroupRemoved ', storedGroup)
    //if the storedGroup is active, we will keep it saved, the group will only be removed when it is inactive
    if (storedGroup.active) {
        console.log('dont remove')
        return;
    }

    console.log('remove')
    await Storage.remove(group.id);
}

/**
 * what is supposed to happen when a group gets updated
 * @param {Object} group 
 */
export async function onTabGroupUpdated(group) {
    // console.log('onUpdated: ', group)
    let storedGroup = await Storage.get(group.id)
    if (!storedGroup) return;
    storedGroup = new TabGroup(storedGroup[group.id]);
    if (!storedGroup.id || !storedGroup.active) return;
    storedGroup.patch(new TabGroup(group));
    Storage.set(storedGroup.id, storedGroup);
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
    if (createdtab.groupId == -1) return;

    // console.log('created Tab: \n', createdtab);

    const tab = new Tab(createdtab);

    //get the tabgroup
    const tabgroup = await Storage.get(createdtab.groupId)[createdtab.groupId];

    if (!tabgroup.active) return;

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

    // console.log('removed: \n', tabId, removeInfo);

    //window is not closing so remove the tab from the tabgroup if it is in one

    //the tab has been removed
    //the event doesn't tell you in which tabgroup the tab was or if it was in one at all, so this needs to be checked
    const storedTabGroups = (await Storage.list()).map(item => new TabGroup(item));
    const storedGroup = storedTabGroups.find(group => {
        //if the group is inactive ignore it
        if (!group.active) return false;

        const tab = group.tabs?.find(tab => tab.id == tabId);
        return !!tab;
    })

    //if the tabgroup wasn't found return
    if (!storedGroup) return;
    //else update it
    storedGroup.tabs.filter(tab => tab.id != tabId);
    Storage.set(storedGroup.id, storedGroup);
    return;
}

/**
 * what happens when a tab is updated
 * @param {String} tabId 
 * @param {Object} changeInfo 
 */
export async function onTabUpdated(tabId, changeInfo, tab) {
    //if there is no groupId on the tab and the groupId hasn't been changed, there is nothing todo
    if (tab.groupId == -1 && !changeInfo.groupId) return;
    // console.log('updated: \n', tabId, changeInfo, tab);

    if (tab.groupId == -1) {
        //the tab has been removed from the tabgroup. this should be synced.
        //the event doesn't tell you however which tabgroup it was removed from so we need to find the tab group first
        const storedTabGroups = (await Storage.list()).map(item => new TabGroup(item));
        const storedGroup = storedTabGroups.find(group => {
            //if the group is inactive ignore it
            if (!group.active) return false;

            const tab = group.tabs?.find(tab => tab.id == tabId);
            return !!tab;
        })

        //if the tabgroup wasn't found return
        if (!storedGroup) return;
        //else update it
        storedGroup.tabs.filter(tab => tab.id != tabId);
        Storage.set(storedGroup.id, storedGroup);
        return;
    }

    //find the tapgroup via the groupId
    const tabClass = new Tab(tab)
    let tabGroup = await Storage.get(tab.groupId)
    if (!tabGroup[tab.groupId]) return;
    console.log(tabGroup);
    tabGroup = new TabGroup(tabGroup[tab.groupId]);
    //update the tab inside the tabgroup
    tabGroup.tabs.push(tabClass);
    //save the updated tab group
    Storage.set(tabGroup.id, tabGroup);
}