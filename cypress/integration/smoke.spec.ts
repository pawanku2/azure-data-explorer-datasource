import { e2e } from '@grafana/e2e';

// copied from timestream
const setSelectValue = (container: string, text: string) => {
  // return e2e.flows.selectOption({
  //   clickToOpen: true,
  //   optionText: text,
  //   container: e2e().get(container),
  // });

  // couldn't get above code to work for some reason. need to investigate that
  return e2e().get(container).parent().find(`input`).click({ force: true }).type(text).type('{enter}');
};

// This could be in the e2e lib if it works well
// can we make this async/await instead of promises?
const smokeTestDatasource = (
  datasourceFileName: string,
  datasourceType: string, 
  // dashboardJson, 
  // expectedPanelData
) => {
  // Step 1: Create the datasource
  e2e.scenario({
    describeName: 'Smoke tests',
    itName: 'Login, create data source, dashboard with variable and panel',
    scenario: () => {
      e2e()
        .readProvisions([datasourceFileName])
        .then(([provision]) => {
          const datasource = provision.datasources[0];
          console.log(datasource)
          return e2e.flows.addDataSource({
            checkHealth: false,
            expectedAlertMessage: 'Connection success',
            form: () => {
              // note: not going to use selectors for now because to do so 
              // I would have to upgrade to e2e and when I do so I get typescript errors
              // todo: find a way to abstract this
              // setSelectValue('[data-testid=adx-cluster-url]', datasource.jsonData.clusterUrl)
              // setSelectValue('[data-testid=adx-tenant-id]', datasource.jsonData.tenantId)
              setSelectValue('[data-testid=adx-client-id]', datasource.jsonData.clientId)
              console.log(datasource)

            },
            type: datasourceType, // not sure what this does tbh
          });
        })
        // .then(() => {
        //   e2e.flows.addDashboard({
        //     timeRange: {
        //       from: '2001-01-31 19:00:00',
        //       to: '2016-01-31 19:00:00',
        //     },
        //     variables: [
        //       {
        //         constantValue: query,
        //         label: 'Template Variable',
        //         name: queryVariable,
        //         type: e2e.flows.VARIABLE_TYPE_CONSTANT,
        //       },
        //     ],
        //   });
        //   addTablePanel('$' + queryVariable);
        // });
    },
  });
  // Step 2: Import a dashboard with panel json maybe (maybe there's just one panel?)

  // Step 3: Find a panel on the dashboard (maybe just one panel for now) click inspect -> json -> panel data

  // Step 4: Now use Jest to see that it is as we expect (or that it hasn't changed?)
};

smokeTestDatasource(
  'datasources/adx.yaml',
  'Azure Data Explorer Datasource'
)