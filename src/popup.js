const { body } = document;

chrome.storage.sync.get('blockedIds', ({ blockedIds }) => {
  console.log('creating buttons for:', blockedIds);
  const btns = blockedIds.map(id => {
    const btn = document.createElement('button');
    btn.value = id;
    btn.innerHTML = id;
    btn.addEventListener('click', handler);
    return btn;
  });

  console.log('btns', btns);
  btns.forEach(b => body.appendChild(b));
});

const removeOnClickForId = id => (`
  console.log('stripping handler for ${id}');
  const a = document.getElementsByClassName('${id}').item(0);
  const b = a.cloneNode(true);
  b.addEventListener('click', () => alert('Use the keyboard!'));
  a.parentNode.replaceChild(b, a);
`);

const handler = event => (
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: removeOnClickForId(event.target.value) },
      )
    }
  )
);
