import React, { useEffect, useState, useCallback } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { FetchResponse } from '@grafana/runtime';
import ConfigHelp from 'components/ConfigEditor/ConfigHelp';
import { AdxDataSourceOptions, AdxDataSourceSecureOptions } from 'types';
import ConnectionConfig from './ConnectionConfig';
import DatabaseConfig from './DatabaseConfig';
import QueryConfig from './QueryConfig';
import { refreshSchema, Schema } from './refreshSchema';
import TrackingConfig from './TrackingConfig';
import { Alert } from '@grafana/ui';

interface ConfigEditorProps
  extends DataSourcePluginOptionsEditorProps<AdxDataSourceOptions, AdxDataSourceSecureOptions> {}

type FetchErrorResponse = FetchResponse<{
  error?: string;
  message?: string;
  response?: string;
}>;

const ConfigEditor = (props: ConfigEditorProps) => {
  const { options, onOptionsChange } = props;
  const [schema, setSchema] = useState<Schema>({ databases: [], schemaMappingOptions: [] });
  const [schemaError, setSchemaError] = useState<FetchErrorResponse['data']>();
  const { jsonData } = options;
  const databases = schema?.databases;

  const updateSchema = (url: string) => {
    refreshSchema(url)
      .then((data) => {
        setSchema(data);
        setSchemaError(undefined);
      })
      .catch((err: FetchErrorResponse) => setSchemaError(err.data));
  };

  const updateJsonData = useCallback(
    <T extends keyof AdxDataSourceOptions>(fieldName: T, value: AdxDataSourceOptions[T]) => {
      onOptionsChange({
        ...options,
        jsonData: {
          ...jsonData,
          [fieldName]: value,
        },
      });
    },
    [jsonData, onOptionsChange, options]
  );

  useEffect(() => {
    options.id && updateSchema(options.url);
  }, [options.id, options.url]);

  useEffect(() => {
    if (!jsonData.defaultDatabase && databases && databases.length) {
      updateJsonData('defaultDatabase', databases[0].value);
    }
  }, [databases, jsonData.defaultDatabase, updateJsonData]);

  const handleRefreshClick = useCallback(() => {
    updateSchema(options.url);
  }, [options.url]);

  const handleClearClientSecret = useCallback(() => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        ...options.secureJsonData,
        clientSecret: false,
      },
      secureJsonFields: {
        ...options.secureJsonFields,
        clientSecret: false,
      },
    });
  }, [onOptionsChange, options]);

  return (
    <>
      <ConfigHelp />

      <ConnectionConfig
        options={options}
        onOptionsChange={onOptionsChange}
        updateJsonData={updateJsonData}
        handleClearClientSecret={handleClearClientSecret}
      />

      <QueryConfig options={options} onOptionsChange={onOptionsChange} updateJsonData={updateJsonData} />

      <DatabaseConfig
        schema={schema}
        options={options}
        onOptionsChange={onOptionsChange}
        updateJsonData={updateJsonData}
        onRefresh={handleRefreshClick}
      />

      <TrackingConfig options={options} onOptionsChange={onOptionsChange} updateJsonData={updateJsonData} />

      {schemaError && (
        <Alert severity="error" title="Error updating Azure Data Explorer schema">
          {schemaError.message}
        </Alert>
      )}
    </>
  );
};

export default ConfigEditor;
