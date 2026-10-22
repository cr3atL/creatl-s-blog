// @vitest-environment node
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const scriptFrom = (file: string) => {
  const html = readFileSync(file, 'utf8');
  const script = html.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error(`Missing redirect script in ${file}`);
  return script;
};

test.each([
  '/creatl-s-blog/songs/maimai',
  '/creatl-s-blog/randomssiba?ui=legacy#media',
  '/creatl-s-blog/songs/sdvx?search=A%26B&literal=~and~&plus=%2B#sheet',
  '/creatl-s-blog/missing/%E6%9B%B2%E5%90%8D?value=x%3Fy%3Dz',
])('Pages fallback restores %s before React mounts', (path) => {
  const original = new URL(path, 'https://cr3atl.github.io');
  let redirected = '';
  runInNewContext(scriptFrom('public/404.html'), {
    window: { location: {
      protocol: original.protocol, hostname: original.hostname, port: original.port,
      pathname: original.pathname, search: original.search, hash: original.hash,
      replace: (url: string) => { redirected = url; },
    } },
    encodeURIComponent,
  });
  const destination = new URL(redirected);
  expect(destination.pathname).toBe('/creatl-s-blog/');
  let restored = '';
  runInNewContext(scriptFrom('index.html'), {
    window: {
      location: { pathname: destination.pathname, search: destination.search, hash: destination.hash },
      history: { replaceState: (_state: unknown, _title: unknown, url: string) => { restored = url; } },
    },
    URLSearchParams,
  });
  expect(restored).toBe(original.pathname + original.search + original.hash);
});
