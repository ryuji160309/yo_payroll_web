import './style.css';
import { APP_VERSION } from './constants';
import { loadSettings } from './settings';
import { renderStoreList } from './components/StoreList';
import { createSettingsModal } from './components/SettingsModal';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  const header = document.createElement('header');
  const ver = document.createElement('span');
  ver.textContent = APP_VERSION;
  const gear = document.createElement('button');
  gear.textContent = '⚙';
  gear.className = 'settings-btn';
  header.appendChild(ver);
  header.appendChild(gear);
  app.appendChild(header);

  const main = document.createElement('main');
  app.appendChild(main);

  let settings = loadSettings();
  const render = () => renderStoreList(main, settings, (id) => console.log('select store', id));
  render();

  gear.addEventListener('click', () => {
    createSettingsModal(settings, (next) => {
      settings = next;
      render();
    }).showModal();
  });
}
