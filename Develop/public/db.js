const indexedDB = window.indexedDB

// instantiate indexedDB, name of collection + version

const req = indexedDB.open('budget', 1);

// requests depending on what returns as status

// create objectstore named pending, when permutation added increase number
req.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore('pending',  {autoIncrement: true} );
};

//if db request is successful, take db and refer to that as target
req.onsuccess = ({ target }) => {
    db = target.result;
}

//checking if app is online before reading db
if(navigator.onLine) {
    checkDB();
}