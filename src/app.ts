//#region imports
import { CommonModule } from '@angular/common'; // @browser
import { NgModule, inject, Injectable } from '@angular/core'; // @browser
import { Component, OnInit } from '@angular/core'; // @browser
import { VERSION } from '@angular/core'; // @browser
import Aura from '@primeng/themes/aura'; // @browser
import { MaterialCssVarsModule } from 'angular-material-css-vars'; // @browser
import { providePrimeNG } from 'primeng/config'; // @browser
import { Observable, map } from 'rxjs';
import { Taon, BaseContext, TAON_CONTEXT } from 'taon/src';
import { Helpers, UtilsOs } from 'tnp-core/src';

import { HOST_URL, FRONTEND_HOST_URL } from './app.hosts';
//#endregion

console.log('hello world');
console.log('Your server will start on port ' + HOST_URL.split(':')[2]);

//#region taon-ui component
//#region @browser
@Component({
  selector: 'app-taon-ui',
  standalone: false,
  template: `hello from taon-ui<br />
    Angular version: {{ angularVersion }}<br />
    <br />
    users from backend
    <ul>
      <li *ngFor="let user of users$ | async">{{ user | json }}</li>
    </ul> `,
  styles: [
    `
      body {
        margin: 0px !important;
      }
    `,
  ],
})
export class TaonUiComponent {
  angularVersion =
    VERSION.full +
    ` mode: ${UtilsOs.isRunningInWebSQL() ? ' (websql)' : '(normal)'}`;
  userApiService = inject(UserApiService);
  readonly users$: Observable<User[]> = this.userApiService.getAll();
}
//#endregion
//#endregion

//#region  taon-ui api service
//#region @browser
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  userController = Taon.inject(() => MainContext.getClass(UserController));
  getAll() {
    return this.userController
      .getAll()
      .received.observable.pipe(map(r => r.body.json));
  }
}
//#endregion
//#endregion

//#region  taon-ui module
//#region @browser
@NgModule({
  providers: [
    {
      provide: TAON_CONTEXT,
      useValue: MainContext,
    },
    providePrimeNG({
      // inited ng prime - remove if not needed
      theme: {
        preset: Aura,
      },
    }),
  ],
  exports: [TaonUiComponent],
  imports: [
    CommonModule,
    MaterialCssVarsModule.forRoot({
      // inited angular material - remove if not needed
      primary: '#4758b8',
      accent: '#fedfdd',
    }),
  ],
  declarations: [TaonUiComponent],
})
export class TaonUiModule {}
//#endregion
//#endregion

//#region  taon-ui entity
@Taon.Entity({ className: 'User' })
class User extends Taon.Base.AbstractEntity {
  //#region @websql
  @Taon.Orm.Column.String()
  //#endregion
  name?: string;
}
//#endregion

//#region  taon-ui controller
@Taon.Controller({ className: 'UserController' })
class UserController extends Taon.Base.CrudController<User> {
  entityClassResolveFn = () => User;
  //#region @websql
  /**
   * @deprecated use migrations instead
   */
  async initExampleDbData(): Promise<void> {
    const superAdmin = new User();
    superAdmin.name = 'super-admin';
    await this.db.save(superAdmin);
  }
  //#endregion
}
//#endregion

//#region  taon-ui context
var MainContext = Taon.createContext(() => ({
  host: HOST_URL,
  frontendHost: FRONTEND_HOST_URL,
  contextName: 'MainContext',
  contexts: { BaseContext },
  migrations: {
    // PUT TAON MIGRATIONS HERE
  },
  controllers: {
    UserController,
    // PUT TAON CONTROLLERS HERE
  },
  entities: {
    User,
    // PUT TAON ENTITIES HERE
  },
  database: true,
  // disabledRealtime: true,
}));
//#endregion

async function start() {
  await MainContext.initialize();

  if (Taon.isBrowser) {
    const users = (
      await MainContext.getClassInstance(UserController).getAll().received
    ).body?.json;
    console.log({
      'users from backend': users,
    });
  }
}

export default start;
