const STATUSICONS = {
    "1": './assets/table-refresh.png',
    "2": './assets/table-check.png',
    "3": './assets/table-remove.png'
}

export const statuses = {
    LOADING: 1,
    LOADED: 2,
    ERROR: 3,
};

export function setIconStatus(status) {
    return chrome.action.setIcon({ path: STATUSICONS[status] })
}