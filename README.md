![example workflow](https://github.com/esromneb/open-version-pack/actions/workflows/build.yml/badge.svg)

# open-version-pack
`open-version-pack` is meant for tracking git hashes throughout a ci build. It supports any level of nesting as well as builds that produce a tar, and a subsequent build that consumes that tar.

# Writing
A makefile is included which you can include into your project. As part of your build, you must call the correct make commands to track your build.

The file format is append only, and can be written to forever.

# Nesting
If a new layer of build is running, simply use the `indent` command to indent all of the existing lines in the file, and then append your commands ontop of that.
