const Store = require('electron-store');

const store = new Store();

function createConfig(data) {
    store.set('config', data);
}

function updateConfig(data) {
    const configData = store.get('config');

    const updateData = {
        ...configData,
        ...data
    };

    store.set('config', updateData);
}

function getConfig() {
    return store.get('config');
}

module.exports = {
    createConfig,
    getConfig,
    updateConfig
}