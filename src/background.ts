import { Site } from 'models'
import sites from 'resources/sites'

const mapSiteToCondition = (site: Site) =>
  new chrome.declarativeContent.PageStateMatcher({
    pageUrl: { hostEquals: site.host },
  })

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sites }, () =>
    console.log('Preparing to block clicks on:', sites),
  )
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: sites.map(mapSiteToCondition),
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
})
