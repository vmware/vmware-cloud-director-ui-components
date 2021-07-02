# VMware Cloud Director UI Common Components

## Repo Structure

This [monorepo](https://angular.io/guide/file-structure#multiple-projects) contains four separate but related projects:

### Component Library (./projects/components) `@vcd/ui-components`

Reusable components for vcd-ui and its plugin developers. See its [README](projects/components/README.md)
for further details

### Internalization Library (./projects/i18n) `@vcd/i18n`

Translation code for vcd-ui and its plugin developers. See its [README](projects/i18n/README.md)
for further details

### Examples App (./projects/examples)

The application that showcases `@vcd/ui-components` using `@vmw/ng-live-docs`. 

Run `npm install` first. Then run `npm run build:i18n` followed by `npm run build:components` to build.

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if
you change any of the source files. This is where you'll see changes made in [components](./projects/components).

#### Online Examples 
Visit [our live examples site](https://vmware.github.io/vmware-cloud-director-ui-components/) for live examples, with source code, that you run on stackblitz. Powered by [Live Docs](https://github.com/vmware/live-docs)

### Route Analyzer (./projects/route-analyzer) `@vcd/route-analyzer`

Route Analyzer statically analyzes angular source code and generates a json file with all the available routes,
including the ones from lazy loaded modules. See its [README](projects/route-analyzer/README.md)
for further details

## Peer Dependencies

The component library depends on [Clarity](https://clarity.design/) and [Angular](https://angular.io/)
which must must be installed from your application's `package.json`. See [package.json](package.json) for version
information.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build:i18n` and `npm run build:components`. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test:components`, or `npm run test:i18n` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests (Examples App)

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Cloning the repo

We typically use `git clone https://github.com/vmware/vmware-cloud-director-ui-components ./vcd-ui-common` to avoid
the extremely long folder name.

## Publishing

Publishing happens through the CI/CD pipeline. See [package.json](.github/workflows/ci-cd.yml)

## Versioning

For all official releases, versioning should be semantic as per [NPM's documentation](https://docs.npmjs.com/about-semantic-versioning).

For all development, nightly builds, the version should be created using `npm version prerelease --preid=dev`.

### Steps for publishing an @next release:

-   Update version number in projects/<lib-name>/package.json
-   Push the changes to a remote topic branch and create a pull request into vmware/vmware-cloud-director-ui-components/master
-   Upon approval of the PR, merge that PR into master

Following the above steps makes the CI-CD pipeline to execute publishing job to npm with @next tag(npm publish --tag next)

### Steps for publishing an @latest release:

-   Update version number in projects/<lib-name>/package.json
-   Push the changes to a remote topic branch and create a pull request into vmware/vmware-cloud-director-ui-components/master
-   Upon approval of the PR, Push the changes to remote repo using Git tag using following commands:
    -   Add a Git tag to the HEAD commit that has to be published as latest: `git tag -fa <lib-name>-v[0-999].[0-999].[0-999]`
    -   Push to the remote repo(vmware/vmware-cloud-director-ui-components): `git push git@github.com:vmware/vmware-cloud-director-ui-components.git refs/tags/<lib-name>-v[0-999].[0-999].[0-999]`

Following the above steps makes the CI-CD pipeline to execute publishing job to npm with @latest tag(npm publish)

## Angular CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20. We attempt to
keep the project following CLI guidelines so we can benefit from ng update.

## Further help

To get further help, please file issues on github.

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Components package versions corresponding to VMware cloud director(VCD) application releases

| VCD app releases        | GIT tags           | Components package versions  |
| ------------- |:-------------:| -----:|
| 10.2.0      | components-v1.0.0 | 1.0.0 |
| 10.2.1      | components-v1.1.0      |   1.1.0 |
