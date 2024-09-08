const Store = require('electron-store');

const store = new Store();

function setState(data) {
    const state = store.get('state');

    const updatedState = {
        ...state,
        ...data
    };

    store.set('state', updatedState);
}

function getState() {
    return store.get('state');
}

module.exports = {
    setState,
    getState
}