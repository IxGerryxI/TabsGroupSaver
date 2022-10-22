import { TabGroup } from "./classes/classes.js"
import Storage from "./api/sync-storage.js"

const TABGROUPS = (await Storage.list()).map(item => new TabGroup(item));

console.log(TABGROUPS)