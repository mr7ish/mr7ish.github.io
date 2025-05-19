import { computed, onUnmounted, shallowRef, watch } from "vue";

interface Options {
  /**
   * the database to be connected.
   */
  dbName: string;
  /**
   * the object store to be operated.
   */
  storeName: string;
  /**
   * the version of the database.
   */
  version?: number;
}

export type OperationParams<T extends object = object> = T & { key: string };

export function useIndexedDB(options: Options) {
  const { dbName, storeName, version = 1 } = options;

  const isSupported = computed(() => Boolean(window && "indexedDB" in window));

  let db: IDBDatabase | null = null;

  const error = shallowRef<DOMException | null>(null);

  function connect(): Promise<IDBDatabase | null> {
    return new Promise((resolve) => {
      if (!dbName || !storeName) {
        return resolve(
          setError(
            new DOMException(
              "dbName and storeName are required",
              "ParameterError"
            )
          )
        );
      }

      const request = window.indexedDB.open(dbName, version);

      request.onerror = (event) => {
        console.log("connect db failed...");
        resolve(setError((event.target as IDBOpenDBRequest).error));
      };

      request.onsuccess = (event) => {
        console.log("connect db success ...");
        db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      // 初次创建数据库时 或 版本号升级时 才触发
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: "key",
            autoIncrement: false,
          });
        }
      };
    });
  }

  /**
   * if the key exists, the data will be modified, otherwise, new data will be added
   */
  function set<T extends OperationParams>(data: T | T[]): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!isConnected()) return resolve(false);

        const transaction = db!.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        if (Array.isArray(data)) {
          data.forEach((item) => {
            store.put(item);
          });
        } else {
          store.put(data);
        }

        transaction.oncomplete = () => {
          resolve(true);
        };

        transaction.onerror = (event) => {
          resolve(!!setError((event.target as IDBTransaction).error));
        };
      } catch (err) {
        resolve(false);
        error.value = err;
      }
    });
  }

  /**
   * if not provided the query key, all data will be returned, otherwise, return the data with the query key
   */
  function get<T>(): Promise<T[] | null>;
  function get<T>(key: string): Promise<T | null>;

  async function get(key?: string) {
    return new Promise((resolve) => {
      try {
        if (!isConnected()) return resolve(null);

        const transaction = db!.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        let request: IDBRequest;
        if (key) {
          request = store.get(key as string);
        } else {
          request = store.getAll();
        }

        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => resolve(setError(request.error));
      } catch (err) {
        resolve(null);
        error.value = err;
      }
    });
  }

  /**
   * delete the data with the query key
   */
  function remove(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!isConnected()) return resolve(false);

        const transaction = db!.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(!!setError(request.error));
      } catch (err) {
        resolve(false);
        error.value = err;
      }
    });
  }

  function disconnect() {
    if (db) {
      db.close();
      db = null;
      console.log("disconnect db success...");
    }
  }

  function isConnected() {
    if (!db) {
      return !!setError(new DOMException("database is not connected"));
    }
    return true;
  }

  function setError(err: DOMException | null) {
    error.value = err;
    return null;
  }

  watch(error, (err) => {
    if (err) {
      console.error(err);
    }
  });

  // onUnmounted(() => {
  //   disconnect();
  // });

  return { isSupported, error, connect, disconnect, set, get, remove };
}
