import cds from '@sap/cds';
import express from 'express';
import path from 'path';

if (process.env.NODE_ENV === 'production') {
    cds.once('bootstrap', (app) => {
      app.use(
        '/i18n',
        // @ts-expect-error cds.middlewares.before exists :(
        cds.middlewares.before,
        express.static(path.join(__dirname, '_i18n'), {
            maxAge: 31536000
        }),
      );
    });
} else {
    cds.once('bootstrap', (app) => {
        app.use(
          '/i18n',
          express.static(path.join(__dirname, '_i18n'), {
            maxAge: 31536000
        }),
        );
      });
}

cds.on('served', async () => {
  const db = await cds.connect.to('db');
  db.before('*', (req) => {
    //@ts-expect-error _tx is internal
    req._tx.set({ IS_AUDITOR: `${cds.context.user.is('Auditor')}` })
  });
  db.after('*', (res, req) => {
    req._tx.set({ IS_AUDITOR: undefined })
  });
});

export default cds.server;