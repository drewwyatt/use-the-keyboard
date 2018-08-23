import { Site } from 'models'
import sites from 'resources/sites'
import { lifecycle, rules, storage } from 'services'

const { PageStateMatcher, ShowPageAction } = chrome.declarativeContent

const mapSiteToCondition = (site: Site) =>
  new PageStateMatcher({
    pageUrl: { hostEquals: site.host },
  })

const init = async () => {
  console.log('init')
  console.log('waiting for install...')
  await lifecycle.onInstalled()
  console.log('installed.')
  console.log('Syncing storage and setting adding rules...')
  await Promise.all([
    storage.set({ sites }),
    rules.setPageChangeRules([
      {
        conditions: sites.map(mapSiteToCondition),
        actions: [new ShowPageAction()],
      },
    ]),
  ])
  console.log('Done!')
}

init()
