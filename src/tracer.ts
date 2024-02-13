'use strict';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  IORedisInstrumentation,
  IORedisRequestHookInformation,
} from '@opentelemetry/instrumentation-ioredis';
import { Span } from '@opentelemetry/api';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2'

// Configure the SDK to export telemetry data to the console
// Enable all auto-instrumentations from the meta package
const exporterOptions = {
  url: 'http://localhost:4318/v1/traces',
};

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new MySQL2Instrumentation(),
    new IORedisInstrumentation({
      requestHook: function (
        span: Span,
        requestInfo: IORedisRequestHookInformation,
      ) {
        if (requestInfo.moduleVersion) {
          span.setAttribute(
            'instrumented_library.version',
            requestInfo.moduleVersion,
          );
        }
      },
    }),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-sample-repo',
  }),
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start();

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;