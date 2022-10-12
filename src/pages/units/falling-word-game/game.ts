import { create } from 'rx-immer-react';
import { distinctUntilChanged, filter, map, pairwise } from 'rxjs';
import { uniqueId } from 'lodash';

export interface IEnv {
  container: {
    width: number;
    height: number;
  };
  params: {
    i: number;
    a: number;
    cor: number;
    cof: number;
  };
  itemStyle: {
    size: number;
  };
}

export interface IItem {
  word: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

export interface IGame {
  env: IEnv;
  status: 'running' | 'stopped';
  itemSet: Set<string>;
  items: Record<string, IItem>;
  clock?: number;
  pointer?: {
    timeStamp: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
}

const INIT_GAME: IGame = {
  env: {
    container: { width: 0, height: 0 },
    params: { i: 10, a: 500, cor: 0.6, cof: 0.9 },
    itemStyle: { size: 48 },
  },
  status: 'stopped',
  itemSet: new Set<string>(),
  items: {},
};

const game = create(INIT_GAME);

export default game;

export const items = game.sub<IGame['items']>('items');
export const itemSet = game.sub<IGame['itemSet']>('itemSet');
export const env = game.sub<IEnv>('env');
export const container = env.sub<IEnv['container']>('container');
export const params = env.sub<IEnv['params']>('params');
export const itemStyle = env.sub<IEnv['itemStyle']>('itemStyle');

// 刷新时钟
export const sync = () => {
  game.commit((g) => {
    g.clock = Date.now();
  });
};

// 开始
export const start = () => {
  game.commit((g) => {
    g.clock = Date.now();
    g.status = 'running';
  });

  const { i } = game.value().env.params;
  game.startAffair(() => {
    const interval = setInterval(sync, i);
    return () => {
      clearInterval(interval);
    };
  }, 'play');
};

// 停止
export const stop = () => {
  game.commit((g) => {
    g.status = 'stopped';
    delete g.clock;
  });

  game.stopAffair('play');
};

// 清空
export const clear = () => {
  items.commit((draft) => {
    Object.keys(draft).forEach((key) => {
      delete draft[key];
    });
  });
  itemSet.commit((draft) => {
    draft.clear();
  });
};

// 添加
export const add = (item: { word: string; color: string }) => {
  game.commit((g) => {
    if (g.pointer) {
      const { size } = g.env.itemStyle;
      const width = size;
      const height = size;
      const { x, y, vx, vy } = g.pointer;

      const key = uniqueId('item-');

      g.items[key] = {
        ...item,
        x: x - width / 2,
        y: y - height / 2,
        vx,
        vy,
        width,
        height,
      };
      g.itemSet.add(key);
    }
  });
};

// 界面尺寸变化
export const resize = (size: { width: number; height: number }) => {
  container.commit((container) => {
    container.width = size.width;
    container.height = size.height;
  });
};

// 鼠标移动
export const point = (pointer?: { x: number; y: number }) => {
  const now = Date.now();
  game.commit((g) => {
    if (pointer) {
      if (g.pointer) {
        const c = 0.3;
        const dt = Math.max(now - g.pointer.timeStamp, 1);
        g.pointer.vx = c * ((pointer.x - g.pointer.x) / dt);
        g.pointer.vy = c * ((pointer.y - g.pointer.y) / dt);
        g.pointer.x = pointer.x;
        g.pointer.y = pointer.y;
        g.pointer.timeStamp = now;
      } else {
        g.pointer = { ...pointer, vx: 0, vy: 0, timeStamp: now };
      }
    } else {
      delete g.pointer;
    }
  });
};

// 主循环
const run = (i: number) => {
  game.commit((g) => {
    const { a, cor, cof } = g.env.params;
    const { height } = g.env.container;
    const pad = 0.02 * height;
    const dvy = i * a * 1e-6;
    const tov = 2 * dvy;

    Object.values(g.items).forEach((item) => {
      item.x += i * item.vx;
      item.y += i * item.vy;
      item.vy += dvy;
    });

    Object.values(g.items)
      .filter((item) => item.y + item.height > height)
      .filter((item) => item.vy > 0)
      .forEach((item) => {
        item.vy *= -cor;
        item.vx *= cof;
      });

    Object.entries(g.items)
      .filter(([, item]) => item.y + item.height > height - pad)
      .filter(([, item]) => Math.sqrt(item.vx ** 2 + item.vy ** 2) < tov)
      .forEach(([key]) => {
        delete g.items[key];
        g.itemSet.delete(key);
      });
  });
};

game
  .observe<IGame['clock']>('clock')
  .pipe(
    distinctUntilChanged(),
    pairwise(),
    filter(function (v): v is [number, number] {
      return v[0] !== undefined && v[1] !== undefined;
    }),
    map(([pt, ct]) => ct - pt),
  )
  .subscribe(run);
