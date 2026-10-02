import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function netlifyFunctionsDevPlugin(): Plugin {
  return {
    name: 'netlify-functions-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/.netlify/functions/')) {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
          const pathname = url.pathname;
          let functionFile = '';

          if (pathname.endsWith('/rsvp')) {
            functionFile = path.resolve(process.cwd(), 'netlify/functions/rsvp.ts');
          } else if (pathname.endsWith('/responses')) {
            functionFile = path.resolve(process.cwd(), 'netlify/functions/responses.ts');
          } else if (pathname.endsWith('/admin')) {
            functionFile = path.resolve(process.cwd(), 'netlify/functions/admin.ts');
          }

          if (functionFile) {
            try {
              const mod = await server.ssrLoadModule(functionFile);
              const handler = mod.default || mod.handler;

              let bodyBuffer = '';
              if (req.method === 'POST') {
                for await (const chunk of req) {
                  bodyBuffer += chunk;
                }
              }

              const headers: Record<string, string> = {};
              for (const [key, value] of Object.entries(req.headers)) {
                if (typeof value === 'string') {
                  headers[key] = value;
                } else if (Array.isArray(value)) {
                  headers[key] = value.join(', ');
                }
              }

              const webReq = new Request(url.href, {
                method: req.method,
                headers,
                body: req.method === 'POST' ? bodyBuffer : undefined,
              });

              const webRes: Response = await handler(webReq);
              res.statusCode = webRes.status;
              webRes.headers.forEach((val, key) => {
                res.setHeader(key, val);
              });
              const text = await webRes.text();
              res.end(text);
              return;
            } catch (err) {
              console.error('Local Netlify function error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Function execution error in dev server' }));
              return;
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), netlifyFunctionsDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

