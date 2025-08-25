import { AppSettings } from '../types';

export function renderStoreList(container: HTMLElement, settings: AppSettings, onSelect: (id: string) => void): void {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'store-list';
  settings.stores.forEach((store) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = store.name;
    btn.className = 'store-btn';
    btn.addEventListener('click', () => onSelect(store.id));
    li.appendChild(btn);
    list.appendChild(li);
  });
  container.appendChild(list);
}
