export const query = async () =>
  new Promise<chrome.tabs.Tab[]>(res =>
    chrome.tabs.query({ active: true, currentWindow: true }, res),
  )

export const executeScript = async (
  tabId: number,
  details: chrome.tabs.InjectDetails,
) => new Promise<any[]>(res => chrome.tabs.executeScript(tabId, details, res))
