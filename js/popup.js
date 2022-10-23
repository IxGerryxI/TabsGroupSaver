import { TabGroup } from "./classes/classes.js"
import Storage from "./api/sync-storage.js"
import COLORS from "./colors.js"

const TABGROUPS = (await Storage.list()).map(item => new TabGroup(item));

console.log(TABGROUPS)

displayTabgroups();

function displayTabgroups() {
    const tabgroupContainer = document.getElementById('tabgroupsContainer');
    for (const tabGroup of TABGROUPS) {
        const tabGroupHTML = getTabGroupHtml(tabGroup);
        tabgroupContainer.innerHTML += tabGroupHTML;
    }
}

function getTabGroupHtml(tabGroup) {
    const tabsHtml = getTabsHtml(tabGroup.tabs);
    const tabGroupHTML = `
            <div class="tabgroup ${tabGroup.active ? 'synced' : 'unsynced'}">
                <details>
                    <summary>
                        <div class="sync_status" style="background-color: ${tabGroup.active ? COLORS[tabGroup.color] : '#EBEBE4'}">
                            <button class="icon_btn toggleSyncButton sync_on_icon">
                                <img src="./assets/sync.png" alt="sync-on">
                            </button>
                            <button class="icon_btn toggleSyncButton sync_off_icon">
                                <img src="./assets/sync-off.png" alt="sync-on">
                            </button>
                        </div>
                        <h2 class="title">${tabGroup.title}</h2>
                        <div class="flex-spacer"></div>
                        <div class="action_btn">
                            <button class="icon_btn openTabgroupBtn">
                                <img src="./assets/open.png" alt="open">
                            </button>
                            <button class="icon_btn deleteBtn">
                                <img src="./assets/delete.png" alt="delete">
                            </button>
                            <button class="icon_btn openSummaryBtn details_closed_icon">
                                <img src="./assets/chevron-down.png" alt="">
                            </button>
                            <button class="icon_btn closeSummaryBtn details_open_icon">
                                <img src="./assets/chevron-up.png" alt="">
                            </button>
                        </div>
                    </summary>
                    <div>
                        ${tabsHtml}
                    </div>
                </details>
            </div>
        `;
    return tabGroupHTML;
}

/**
 * 
 * @param {Array<Objects>} tabs 
 */
function getTabsHtml(tabs) {
    let tabshtml = '';
    for (const tab of tabs) {
        const tabHtml = `
            <div class="tab">
                <img src="${tab.favIconUrl || './assets/web.png'}" alt="newTab">
                <div class="title">${tab.title}</div>
                <div class="flex-spacer"></div>
                <div class="action_button">
                    <a class="icon_btn" href="${tab.url}" target="blank">
                        <img src="./assets/open-in-new.png" alt="open in new tab">
                    </a>
                </div>
            </div>
        `;
        tabshtml += tabHtml + '\n';
    }
    return tabshtml;
}