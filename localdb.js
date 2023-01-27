
import PouchDB from 'pouchdb';
import PouchAuth from 'pouchdb-authentication';

const localDB = new PouchDB('dukapp001');
// Please update the CouchDB URL in case of any change
// Here "/docs" is the my database name
// You can change it with your own database name
const remoteDB = new PouchDB(
    'http://localhost:5984/docs',
    { skip_setup: true }
);
PouchDB.plugin(PouchAuth);

const syncStates = [
    'change',
    'paused',
    'active',
    'denied',
    'complete',
    'error',
];
// Please update the username and password of the couchDB
remoteDB.login('admin', 'admin').then(function () {
    const sync = localDB.sync(remoteDB, {
        live: true,
        retry: true,
    });
    syncStates.forEach((state) => {
        sync.on(state, setCurrentState.bind(this, state));
        function setCurrentState(state) {
            console.log('[Sync:' + state + ']');
        }
    });
});

export default localDB;