import { admin, adminKey, host } from '@src/config/vars';
import { useAppSelector } from '@src/store/hooks';
import axios from 'axios';
import { useEffect } from 'react';

export const useAdmin = () => {
  const username = useAppSelector((s) => s.user.username);
  useEffect(() => {
    if (username !== admin) return;
    let canDownload = true;
    const handleKeydown = (e: KeyboardEvent) => {
      if (canDownload && e.metaKey && e.ctrlKey && e.altKey && e.key === adminKey) {
        canDownload = false;
        axios.get(host + 'admin/logs').then((data) => {
          download('logs.log', data.data);
          setTimeout(() => (canDownload = true), 1000);
        });
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
};

function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
