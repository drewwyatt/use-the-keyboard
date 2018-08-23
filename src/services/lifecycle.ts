export const onInstalled = async () =>
  new Promise(res => chrome.runtime.onInstalled.addListener(res))
