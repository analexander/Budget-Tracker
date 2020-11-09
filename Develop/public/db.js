const indexedDB = window.indexedDB

// instantiate indexedDB, name of collection + version

const req = indexedDB.open('budget', 1);

// requests depending on what returns as status

// create objectstore named pending, when permutation added increase number
req.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore('pending', { autoIncrement: true });
};

// if db request is successful, take db and refer to that as target
req.onsuccess = ({ target }) => {
    db = target.result;
}

// checking if app is online before reading db
if (navigator.onLine) {
    checkDB();
};

// if db request is not successful, throw error
req.onerror = e => {
    console.log('Error:' + e.target.errorCode);
}

// allowing access to readwrite to store, add record to store
saveRecord = record => {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');

    store.add(record);
}

// checking db for any stored records, on success fetch post from api to send records to the db then delete from store
checkDB = () => {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    return res.json();
                })
                .then(() => {
                    // delete records if successful
                    const transaction = db.transaction(['pending'], 'readwrite');
                    const store = transaction.objectStore('pending');
                    store.clear();
                });
        }
    };
}