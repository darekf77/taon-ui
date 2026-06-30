//#region imports
import * as os from 'os'; // @backend
console.log('asdas');
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common'; // @browser
import {
  inject,
  Injectable,
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  mergeApplicationConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core'; // @browser
import { Component } from '@angular/core'; // @browser
import { VERSION, OnInit } from '@angular/core'; // @browser
import { toSignal } from '@angular/core/rxjs-interop'; // @browser
import { MatButtonModule } from '@angular/material/button'; // @browser
import { MatCardModule } from '@angular/material/card'; // @browser
import { MatDividerModule } from '@angular/material/divider'; // @browser
import { MatIconModule } from '@angular/material/icon'; // @browser
import { MatListModule } from '@angular/material/list'; // @browser
import { MatTabsModule } from '@angular/material/tabs'; // @browser
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideRouter,
  Router,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  ActivatedRoute,
  Routes,
  Route,
  withHashLocation,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { RenderMode, ServerRoute } from '@angular/ssr';
import Aura from '@primeng/themes/aura'; // @browser
import { providePrimeNG } from 'primeng/config'; // @browser
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import {
  Taon,
  TaonBaseContext,
  TAON_CONTEXT,
  EndpointContext,
  TaonBaseAngularService,
  TaonEntity,
  StringColumn,
  TaonBaseAbstractEntity,
  TaonBaseCrudController,
  TaonController,
  GET,
  TaonMigration,
  TaonBaseMigration,
  TaonContext,
} from 'taon/src';
import { Utils, UtilsOs } from 'tnp-core/src';

import { HOST_CONFIG } from './app.hosts';
import { ENV_ANGULAR_NODE_APP_BUILD_PWA_DISABLE_SERVICE_WORKER } from './lib/env/env.angular-node-app';
// @placeholder-for-imports
import { TranslationAppActiveContext } from './app/translation-app/translation-app.active.context'; // @app-ts-generated

//#endregion

const firstHostConfig = (Object.values(HOST_CONFIG) || [])[0];
console.log('Your backend host ' + firstHostConfig?.host);
console.log('Your frontend host ' + firstHostConfig?.frontendHost);

//#region taon-ui component

//#region @browser
@Component({
  selector: 'app-root',

  imports: [
    // RouterOutlet,
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    RouterModule,
    JsonPipe,
  ],
  template: `
    @if (itemsLoaded()) {
      @if (navItems.length > 0) {
        <nav
          mat-tab-nav-bar
          class="shadow-1"
          [tabPanel]="tabPanel">
          @for (item of navItems; track item.path) {
            <a
              mat-tab-link
              href="javascript:void(0)"
              [style.text-decoration]="
                (activePath === item.path && !forceShowBaseRootApp) ||
                ('/' === item.path && forceShowBaseRootApp)
                  ? 'underline'
                  : 'none'
              "
              (click)="navigateTo(item)">
              @if (item.path === '/') {
                <mat-icon
                  aria-hidden="false"
                  aria-label="Example home icon"
                  fontIcon="home"></mat-icon>
              } @else {
                {{ item.label }}
              }
            </a>
          }
        </nav>

        <mat-tab-nav-panel #tabPanel>
          @if (!forceShowBaseRootApp) {
            <router-outlet />
          }
        </mat-tab-nav-panel>
      }
      @if (navItems.length === 0 || forceShowBaseRootApp) {
        <mat-card class="m-2">
          <mat-card-content>
            <h3>Basic app info</h3>
            Name: taasdaasdon-ui<br />
            Angular version: {{ angularVersion }}<br />
            Taon backend: {{ taonMode }}<br />
          </mat-card-content>
        </mat-card>

        <mat-card class="m-2">
          <mat-card-content>
            <h3>Example users from backend API:</h3>
            <ul>
              @for (user of users(); track user.id) {
                <li>
                  {{ user | json }}
                  <button
                    mat-flat-button
                    (click)="deleteUser(user)">
                    <mat-icon>delete user</mat-icon>
                  </button>
                </li>
              }
            </ul>
            <br />
            <button
              class="ml-1"
              matButton="outlined"
              (click)="addUser()">
              Add new example user with random name
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="m-2">
          <mat-card-content>
            <h3>Example hello world from backend API:</h3>
            hello world from backend: <strong>{{ hello$ | async }}</strong>
          </mat-card-content>
        </mat-card>
      }
    }
  `,
})
export class TaonUiApp implements OnInit {
  itemsLoaded = signal(false);

  navItems =
    TaonUiClientRoutes.length <= 1
      ? []
      : TaonUiClientRoutes.filter(r => r.path !== undefined).map(r => ({
          path: r.path === '' ? '/' : `/${r.path}`,
          label: r.path === '' ? 'Home' : `${r.path}`,
        }));

  activatedRoute = inject(ActivatedRoute);

  get activePath(): string {
    return globalThis?.location.pathname?.split('?')[0];
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(globalThis?.location.pathname);
    // TODO set below from 1000 to zero in production
    Taon.removeLoader(1000).then(() => {
      this.itemsLoaded.set(true);
    });
  }

  taonMode = UtilsOs.isRunningInWebSQL() ? 'websql' : 'normal nodejs';

  angularVersion = VERSION.full;

  router = inject(Router);

  private refresh = new BehaviorSubject<void>(undefined);

  forceShowBaseRootApp = false;

  navigateTo(item: { path: string; label: string }): void {
    if (item.path === '/') {
      if (this.forceShowBaseRootApp) {
        return;
      }
      this.forceShowBaseRootApp = true;
      return;
    }
    this.forceShowBaseRootApp = false;
    this.router.navigateByUrl(item.path);
  }
}
//#endregion

//#endregion

//#region  taon-ui routes
//#region @browser
export const TaonUiServerRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
export const TaonUiClientRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      if (TaonUiClientRoutes.length === 1) {
        return '';
      }
      return TaonUiClientRoutes.find(r => r.path !== '')!.path!;
    },
  },
  // PUT ALL ROUTES HERE
  // @placeholder-for-routes
  // @app-ts-generated
  {
    path: 'translation-app',
    providers: [
      {
        provide: TAON_CONTEXT,
        useFactory: () => TranslationAppActiveContext,
      },
    ],
    loadChildren: () =>
      import('./app/translation-app/translation-app.routes').then(
        m => m.TranslationAppRoutes,
      ),
  },
];
//#endregion
//#endregion

//#region  taon-ui app configs
//#region @browser
export const TaonUiAppConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => TaonUiStartFunction,
    },
    provideBrowserGlobalErrorListeners(),
    // remove withHashLocation() to use SSR
    provideRouter(TaonUiClientRoutes, withHashLocation()),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled:
        !isDevMode() && !ENV_ANGULAR_NODE_APP_BUILD_PWA_DISABLE_SERVICE_WORKER,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

export const TaonUiServerConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(TaonUiServerRoutes))],
};

export const TaonUiConfig = mergeApplicationConfig(
  TaonUiAppConfig,
  TaonUiServerConfig,
);
//#endregion
//#endregion

//#region  taon-ui start function
export const TaonUiStartFunction = async (
  startParams?: Taon.StartParams,
): Promise<void> => {
  //#region @backend
  if (
    startParams?.onlyMigrationRun ||
    startParams?.onlyMigrationRevertToTimestamp
  ) {
    process.exit(0);
  }
  //#endregion

  //#region @backend
  console.log(`Hello in NodeJs backend! os=${os.platform()}`);
  //#endregion
};
//#endregion

export default TaonUiStartFunction;
