import * as React from 'react'
import { render } from 'react-dom'
import { State, Site, Hotkey, AttributeType } from 'models'
import { env, storage, tabs } from 'services'
import { curry, pipeP } from 'ramda'
import { init as initSentry, captureEvent, Severity } from '@sentry/browser'

initSentry({
  dsn: env.sentryDSN,
})

const log = (message: string) =>
  captureEvent({
    message,
    level: Severity.Debug,
  })

const reactRoot = document.createElement('main')
document.body.appendChild(reactRoot)

const mapSiteToTable = (site: Site, idx: number): JSX.Element => (
  <table key={`site[${idx}]`}>
    <thead>
      <th colSpan={2}>{site.host}</th>
    </thead>
    <tbody>{site.hotkeys.map(mapHotkeyToRow)}</tbody>
  </table>
)

const mapHotkeyToRow = (
  { attribute, description, key, value }: Hotkey,
  idx: number,
): JSX.Element => (
  <tr key={`hotkey[${idx}]`}>
    <td>{description}</td>
    <td>
      <button onClick={createClickHandler(attribute, value, key)}>Block</button>
    </td>
  </tr>
)

const removeOnClickWithAttr = (
  attr: AttributeType,
  key: string,
  val: string,
): string => `
  console.log('removing onclick', '${attr}', '${key}', '${val}');
  if ('${attr}' === 'class') {
    const els = document.getElementsByClassName('${val}');
    Array.prototype.forEach.call(els, a => {
      const b = a.cloneNode(true);
      b.addEventListener('click', () => alert('Use the keyboard. Press ' + '${key}' + '!'));
      a.parentNode.replaceChild(b, a);
    });
  } else {
    // TODO: id
  }
`

const blockClickOnTabWithAttrs = (
  attr: AttributeType,
  value: string,
  key: string,
  _: React.MouseEvent<HTMLButtonElement>,
) =>
  pipeP(
    tabs.query,
    wrapInPromise(extractActiveTabId),
    tryExecuteScriptOnTab(attr, value, key),
  )({})

const createClickHandler = curry(blockClickOnTabWithAttrs)

const wrapInPromise = <T extends Function>(func: T) => (...args: any[]) =>
  Promise.resolve(func(...args))

const extractActiveTabId = (tabs: chrome.tabs.Tab[]) =>
  console.log('extractActiveTabId', tabs) || (tabs && tabs[0])
    ? tabs[0].id
    : null

const tryExecuteScriptOnTab = (
  attrType: AttributeType,
  value: string,
  key: string,
) => (tabId: number | null) =>
  tabId
    ? tabs.executeScript(tabId, {
        code: removeOnClickWithAttr(attrType, key, value),
      })
    : Promise.reject(new Error('Unable to query tabId'))

const hasSites = (data: object): data is State =>
  !!(data && (data as State).sites)

const init = async () => {
  const data = await storage.get<State>('sites')
  if (hasSites(data)) {
    const tables = data.sites.map(mapSiteToTable)
    render(<>{tables}</>, reactRoot)
  }
}

init()
