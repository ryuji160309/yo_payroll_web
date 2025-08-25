import { AppSettings, StoreConfig } from '../types';
import { saveSettings } from '../settings';

export function createSettingsModal(initial: AppSettings, onSave: (s: AppSettings) => void): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'settings-modal';

  const form = document.createElement('form');
  form.innerHTML = `
    <h2>設定</h2>
    <label>基本時給<input name="baseWage" type="number" value="${initial.baseWage}"/></label>
    <label>時給倍率<input name="overtimeMultiplier" type="number" step="0.01" value="${initial.overtimeMultiplier}"/></label>
    <label>調整(分)<input name="adjustMinutes" type="number" value="${initial.adjustMinutes}"/></label>
    <div class="stores">
      <h3>店舗一覧</h3>
      <div class="store-rows"></div>
      <button type="button" class="add-store">追加</button>
    </div>
    <menu>
      <button type="button" class="cancel">キャンセル</button>
      <button type="submit" class="save">保存</button>
    </menu>
  `;
  dialog.appendChild(form);

  const rows = form.querySelector<HTMLDivElement>('.store-rows')!;

  function addStoreRow(store: StoreConfig = { id: crypto.randomUUID(), name: '', url: '' }) {
    const row = document.createElement('div');
    row.className = 'store-row';
    row.dataset.id = store.id;
    row.innerHTML = `
      <input class="store-name" placeholder="店舗名" value="${store.name}"/>
      <input class="store-url" placeholder="URL" value="${store.url}"/>
      <button type="button" class="up">↑</button>
      <button type="button" class="down">↓</button>
      <button type="button" class="delete">×</button>
    `;
    rows.appendChild(row);

    row.querySelector<HTMLButtonElement>('.delete')!.onclick = () => row.remove();
    row.querySelector<HTMLButtonElement>('.up')!.onclick = () => {
      const prev = row.previousElementSibling;
      if (prev) rows.insertBefore(row, prev);
    };
    row.querySelector<HTMLButtonElement>('.down')!.onclick = () => {
      const next = row.nextElementSibling;
      if (next) rows.insertBefore(next, row);
    };
  }

  initial.stores.forEach((s) => addStoreRow(s));

  form.querySelector<HTMLButtonElement>('.add-store')!.onclick = () => addStoreRow();
  form.querySelector<HTMLButtonElement>('.cancel')!.onclick = () => dialog.close();

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const next: AppSettings = {
      ...initial,
      baseWage: Number(data.get('baseWage')),
      overtimeMultiplier: Number(data.get('overtimeMultiplier')),
      adjustMinutes: Number(data.get('adjustMinutes')),
      stores: Array.from(rows.children).map((row) => {
        const el = row as HTMLDivElement;
        return {
          id: el.dataset.id!,
          name: (el.querySelector('.store-name') as HTMLInputElement).value.trim(),
          url: (el.querySelector('.store-url') as HTMLInputElement).value.trim(),
        } as StoreConfig;
      }),
    };
    saveSettings(next);
    onSave(next);
    dialog.close();
  };

  document.body.appendChild(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  return dialog;
}
