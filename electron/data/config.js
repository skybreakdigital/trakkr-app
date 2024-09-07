const Store = require('electron-store');

const store = new Store();

function createConfig(data) {
    store.set('config', data);
}

function getConfig() {
    return store.get('config');
}

module.exports = {
    createConfig,
    getConfig
}