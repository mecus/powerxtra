
import { Routes } from "@angular/router";
import { PresenterDeck } from "./presenter/presenter";

export const PresenterRoutes: Routes = [
  {
    path: '', component: PresenterDeck
  },
  {
    path: 'presenter', component: PresenterDeck
  }
]
