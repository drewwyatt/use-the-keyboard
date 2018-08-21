import { State } from 'models'
import { html } from 'utils'

const { body } = document

chrome.storage.sync.get('sites', state => {
  const { sites } = state as State
  console.log('creating buttons for:', sites)
  sites.map(site => {
    const table = html.table()
    site.hotkeys.forEach(hotkey => {
      const row = html.tr()
      const labelCell = html.td()
      labelCell.innerText = site.host
      const buttonCell = html.td()
      const btn = html.button()
      btn.value = `${hotkey.attribute}:${hotkey.key}:${hotkey.value}`
      btn.innerText = `Block ${hotkey.description}`
      btn.addEventListener('click', handler)
      buttonCell.appendChild(btn)

      row.appendChild(labelCell)
      row.appendChild(buttonCell)
      table.appendChild(row)
    })

    body.appendChild(table)
  })
})

const removeOnClickForId = (pair: string): string => `
  const [attr, key, val] = '${pair}'.split(':');
  if (attr === 'class') {
    const els = document.getElementsByClassName(val);
    Array.prototype.forEach.call(els, a => {
      const b = a.cloneNode(true);
      b.addEventListener('click', () => alert('Use the keyboard. Press ' + key + '!'));
      a.parentNode.replaceChild(b, a);
    });
  } else {
    // TODO: id
  }
`

const getTargetValue = (event: any): string =>
  event.target && event.target.value ? (event.target.value as string) : ''

const handler = (event: Event) =>
  chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
    chrome.tabs.executeScript(tabs[0].id!, {
      code: removeOnClickForId(getTargetValue(event)),
    }),
  )
