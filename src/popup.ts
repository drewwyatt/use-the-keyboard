const { body } = document;

const hasIds = (data: any): data is string[] =>
  !!(data && (data as string[]).map && data[0] && (data as string[])[0].charAt);

chrome.storage.sync.get('blockedIds', ({ blockedIds }) => {
  console.log('creating buttons for:', blockedIds);
  if (hasIds(blockedIds)) {
    const btns = blockedIds.map(id => {
      const btn = document.createElement('button');
      btn.value = id;
      btn.innerHTML = id;
      btn.addEventListener('click', handler);
      return btn;
    });

    console.log('btns', btns);
    btns.forEach(b => body.appendChild(b));
  }
});

const removeOnClickForId = (id: string): string => (`
  console.log('stripping handler for ${id}');
  const a = document.getElementsByClassName('${id}').item(0);
  const b = a.cloneNode(true);
  b.addEventListener('click', () => alert('Use the keyboard!'));
  a.parentNode.replaceChild(b, a);
`);

const getTargetValue = (event: any): string =>
  event.target && event.target.value
    ? event.target.value as string
    : '';

const handler = (event: Event) => (
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.executeScript(
        tabs[0].id!,
        { code: removeOnClickForId(getTargetValue(event)) },
      )
    }
  )
);
