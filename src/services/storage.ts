const { sync } = chrome.storage

export const set = async (data: object) =>
  new Promise(res => sync.set(data, res))

export const get = async <T extends object>(key: string): Promise<T | {}> =>
  new Promise(res => sync.get(key, res))
