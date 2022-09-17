import * as THREE from 'three';
// import easing from './easing.js';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useActivate, createAppAsync, useCleanup} = metaversefile;
const localVector = new THREE.Vector3();

// const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default e => {
  const app = useApp();
  // const physics = usePhysics();

  app.name = 'npcs';

  let activateCb = null;
  let frameCb = null;
  useActivate(() => {
    activateCb && activateCb();
  });
  useFrame(() => {
    frameCb && frameCb();
  });

  let live = true;
  e.waitUntil((async () => {
    await Promise.all([
      {
        avatarUrl: `/procgen-assets/avatars/female-procgen.vrm`,
        voice: `Maud Pie`,
      },
      {
        avatarUrl: `/procgen-assets/avatars/male-procgen.vrm`,
        voice: `Discord`,
      },
    ].map(async ({
      avatarUrl,
      voice,
    }, index) => {
      const position = localVector.set(-1 + index * 2, 2, 0);

      let o = await createAppAsync({
        type: 'application/npc',
        content: {
          name: 'Procgen Avatar',
          avatarUrl,
          voice,
          bio: 'A procedurally generated avatar',
          procgen: true,
        },
        position,
        parent: app,
      });
      if (!live) {
        o.destroy();
        return;
      }

      app.add(o);
    }));
  })());
  
  useCleanup(() => {
    live = false;
  });

  return app;
};