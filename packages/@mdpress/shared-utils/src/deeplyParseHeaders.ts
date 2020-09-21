import compose from './compose';
import parseHeaders from './parseHeaders';
import removeNonCodeWrappedHTML from './removeNonCodeWrappedHTML';

// Also clean the html that isn't wrapped by code.
// Because we want to support using REACT components in headers.
export = compose(
  removeNonCodeWrappedHTML,
  parseHeaders
)

