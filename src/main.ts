import './style.css';
import { APP_VERSION } from './constants';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = `<header>v${APP_VERSION}</header>`;
}
