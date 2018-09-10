import { Observable, Observer } from 'rxjs'

export const query = (): Observable<chrome.tabs.Tab[]> =>
  Observable.create((obs: Observer<chrome.tabs.Tab[]>) =>
    chrome.tabs.query(
      { active: true, currentWindow: true },
      obs.next.bind(obs),
    ),
  )

export const executeScript = async (
  tabId: number,
  details: chrome.tabs.InjectDetails,
) => new Promise<any[]>(res => chrome.tabs.executeScript(tabId, details, res))
