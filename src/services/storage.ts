const { sync } = chrome.storage

export const set = async (data: object) =>
  new Promise(res => sync.set(data, res))
