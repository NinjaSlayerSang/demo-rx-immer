import {
  Diachrony,
  diachronyPlugin,
  DiachronyPluginExt,
  historyPlugin,
  HistoryPluginExt,
  logPlugin,
  ReplayModeExt,
} from 'rx-immer';
import { useEffect, useRef } from 'react';
import {
  DiachronyHooksPlugin,
  DiachronyHooksPluginExt,
  historyHooksPlugin,
  HistoryHooksPluginExt,
  RxImmerReact,
  useRxImmer,
} from 'rx-immer-react';
import { skip } from 'rxjs';
import { FieldData } from 'rc-field-form/lib/interface';

import ContainerCard from './components/container-card';
import { ListItem } from './components/table-editor';
import { TreeData } from './components/tree-editor';
import Editor from './components/editor';
import Replay from './replay';
import { INITIAL_STORE } from './const';

export interface Store {
  count: number;
  title?: string;
  list: ListItem[];
  fields: FieldData[];
  obj: Record<string, any>;
  tree: TreeData;
}

export interface ReplayActions {
  open: (diachrony: Diachrony<Store>) => void;
}

export interface PropsWithStore {
  store: RxImmerReact<
    Store,
    Partial<
      HistoryPluginExt &
        HistoryHooksPluginExt &
        DiachronyPluginExt &
        DiachronyHooksPluginExt &
        ReplayModeExt
    >
  >;
}

export default function Playground() {
  const store = useRxImmer<
    Store,
    HistoryPluginExt &
      DiachronyPluginExt &
      HistoryHooksPluginExt &
      DiachronyHooksPluginExt
  >(INITIAL_STORE, [
    historyPlugin({
      capacity: 100,
      bufferDebounce: 500,
    }),
    historyHooksPlugin,
    diachronyPlugin,
    DiachronyHooksPlugin,
    logPlugin(),
  ]);

  const replayRef = useRef<ReplayActions>();

  useEffect(() => {
    store.startAffair(function () {
      const subscription = this.observe('count')
        .pipe(skip(1))
        .subscribe((count: number) => {
          this.commit((state) => {
            state.list.splice(count);
          });
        });
      return function () {
        console.log('affairs:', this.showAffairs());
        subscription.unsubscribe();
      };
    }, 'sync count and list length');
  }, [store]);

  return (
    <>
      <ContainerCard store={store} replayRef={replayRef}>
        <Editor store={store} />
      </ContainerCard>
      <Replay actionRef={replayRef} />
    </>
  );
}
