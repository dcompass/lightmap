#!/bin/bash
package="$1"
version=$(npm show ${package} version)
echo "version:"
echo $(npm show ${package} version)
archive="${package}-${version}.tgz"
curl --silent --remote-name \
  "https://registry.npmjs.org/${package}/-/${archive}"
rm -Rf "./node_modules/${package}"
mkdir "./node_modules/${package}"
tar xzf "${archive}" --strip-components 1 -C "./node_modules/${package}"
rm "${archive}"
