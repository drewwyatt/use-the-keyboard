const page = document.getElementById('buttonDiv');
const buttonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];

const constructorOptions = (colors: string[]) => {
  for (let color of colors) {
    const button = document.createElement('button');
    button.style.backgroundColor = color;
    button.addEventListener('click', () => {
      chrome.storage.sync.set({ color }, () => {
        console.log('color is: ', color);
      });
    });

    if (page) {
      page.appendChild(button);
    }
  }
};

constructorOptions(buttonColors);