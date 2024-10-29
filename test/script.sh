#!/bin/bash

for i in {1..100}; do curl -X POST \
  -H "Content-Type: multipart/form-data"\
  -H "Accept: image/gif"\
  -H "Cache-control: public, max-age=0" \
  -H "Connection: keep-alive"\
  -H "pragma: no-cache" \
  -F 'file=@test/test_asset.mp4;type=video/mp4'\
  'http://localhost:3000/upload'\
  --compressed \
  --insecure -s -o /dev/null -w " %{time_total}s\n";
done