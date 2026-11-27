// CloudFront Function (viewer request), runtime cloudfront-js-2.0.
// 1) Redirects www.indusvectorllc.com -> indusvectorllc.com (301)
// 2) Serves /path/ and /path as /path/index.html from S3
// 3) Redirects a few old WordPress URLs
function handler(event) {
  var req = event.request;
  var host = req.headers.host && req.headers.host.value;
  var uri = req.uri;

  if (host === 'www.indusvectorllc.com') {
    return redirect('https://indusvectorllc.com' + uri);
  }

  var moved = {
    '/sample-page/': '/',
    '/author/mbhupat/': '/blog/',
    '/category/business-solutions/': '/blog/'
  };
  if (moved[uri]) {
    return redirect('https://indusvectorllc.com' + moved[uri]);
  }

  if (uri.endsWith('/')) {
    req.uri = uri + 'index.html';
  } else if (uri.indexOf('.') === -1) {
    return redirect('https://indusvectorllc.com' + uri + '/');
  }
  return req;
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: location } }
  };
}
