import 'dotenv/config';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Configure trace exporter based on environment
// Development: output traces to console for local debugging
// Other environments: send traces to New Relic via OTLP
const traceExporter = isDevelopment
  ? new ConsoleSpanExporter()
  : new OTLPTraceExporter({
      url:
        process.env.NEW_RELIC_OTLP_ENDPOINT ||
        'https://otlp.nr-data.net:4318/v1/traces',
      headers: {
        'api-key': process.env.NEW_RELIC_LICENSE_KEY || '',
      },
    });

// Create resource with service information
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'poc-api',
  [ATTR_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION || '1.0.0',
});

// Create SDK instance with comprehensive auto-instrumentation
const sdk = new NodeSDK({
  resource,
  traceExporter,

  // Sample 10% of traces in production, 100% in development
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(isProduction ? 0.1 : 1.0),
  }),

  // Batch export for better performance
  spanProcessor: new BatchSpanProcessor(traceExporter, {
    maxExportBatchSize: isProduction ? 200 : 50,
    exportTimeoutMillis: isProduction ? 5000 : 2000,
    scheduledDelayMillis: isProduction ? 2000 : 1000,
  }),

  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable high-volume instrumentation in production
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },

      // Configure HTTP instrumentation
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        ignoreIncomingRequestHook: (req) => {
          const ignorePaths = ['/health', '/docs', '/docs/swagger'];

          return ignorePaths.some((path) => req.url?.includes(path));
        },
      },
    }),
  ],
});

export default sdk;
