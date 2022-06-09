import { FunctionComponent, useLayoutEffect, useRef } from 'react';
import { random } from 'lodash';

import { resize, point, add, itemSet } from '../game';
import Item from './Item';

const Screen: FunctionComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const items = itemSet.useBind<Set<string>>();

  useLayoutEffect(() => {
    const { current: container } = containerRef;
    if (!container) return;

    resize({
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      resize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      add({
        word: ev.key,
        color: `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`,
      });
    };

    window.addEventListener('keypress', listener);

    return () => {
      window.removeEventListener('keypress', listener);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        backgroundColor: 'lightgray',
        margin: '14px 0',
        cursor: 'crosshair',
        overflow: 'hidden',
      }}
      onMouseMove={(event) => {
        if (event.target === containerRef.current) {
          point({
            x: event.nativeEvent.offsetX,
            y: event.nativeEvent.offsetY,
          });
        }
      }}
      onMouseLeave={() => {
        point();
      }}
    >
      {Array.from(items.keys()).map((key) => (
        <Item key={key} i={key} />
      ))}
    </div>
  );
};

export default Screen;
