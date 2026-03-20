import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';


export const drawerState = createAction('[ Drawer ] State', props<{open: boolean}>());

export const drawerMode = createAction('[ Drawer ] Mode', props<{mode: string}>());

interface IDrawer {
  open: boolean,
  mode: string
}

const initState: IDrawer = {
  open: true,
  mode: "side"
}

export const drawerReducer = createReducer(
  initState,
  on(drawerState, (state: any, { open }) => ({
     ...state, open
  })),
  on(drawerMode, (state: any, { mode }) => ({
    ...state, mode
  }))
)
