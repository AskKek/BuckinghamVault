import { onCLS, onFCP, onLCP, onTTFB, onINP, CLSMetric, FCPMetric, LCPMetric, TTFBMetric, INPMetric } from 'web-vitals'

type MetricType = CLSMetric | FCPMetric | LCPMetric | TTFBMetric | INPMetric

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    'effectiveType' in (navigator['connection'] as any)
    ? (navigator['connection'] as any).effectiveType
    : ''
}

export function sendToAnalytics(metric: MetricType) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID || 'development'
  
  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  })
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
  }
}

export function reportWebVitals() {
  try {
    onLCP((metric: LCPMetric) => sendToAnalytics(metric))
    onCLS((metric: CLSMetric) => sendToAnalytics(metric))
    onFCP((metric: FCPMetric) => sendToAnalytics(metric))
    onTTFB((metric: TTFBMetric) => sendToAnalytics(metric))
    onINP((metric: INPMetric) => sendToAnalytics(metric))
  } catch (error) {
    console.error('Failed to initialize web vitals reporting:', error)
  }
}