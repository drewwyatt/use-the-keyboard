import * as React from 'react'
import { render } from 'react-dom'
import { State, Site, Hotkey, AttributeType } from 'models'
import { storage, tabs } from 'services'

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
      <button onClick={handlerFor(attribute, value, key)}>Block</button>
    </td>
  </tr>
)

const removeOnClickForId = (
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

const handlerFor = (attr: AttributeType, value: string, key: string) => (
  event: React.MouseEvent<HTMLButtonElement>,
) => {
  console.log('ding', attr, value, key)
  tabs.query().then(t => {
    console.log('tabs queried', t)
    if (t && t.length && t[0].id) {
      tabs.executeScript((t[0] as chrome.tabs.Tab).id as number, {
        code: removeOnClickForId(attr, key, value),
      })
    }
  })
}

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
