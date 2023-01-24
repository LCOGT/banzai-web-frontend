import { bus } from '@/main.js'
export { reportError, reportSuccess, generateReprocessConfirmationText }

function reportError(message) {
  bus.$emit('report-error', { message: message })
}

function reportSuccess(message) {
  bus.$emit('report-success', { message: message })
}

function generateReprocessConfirmationText(reprocessResponse) {
  return `Added ${reprocessResponse.frames_in_queue.length} frame(s) to the BANZAI task queue.
            <br>To view in OpenSearch see: <a href=${reprocessResponse.kibana_url} target="_blank">${reprocessResponse.kibana_url}</a>`
}
