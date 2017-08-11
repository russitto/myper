import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'myper.js',
  format: 'umd',
  dest: 'dist.js',
  moduleName: 'm',
  plugins: [
    uglify()
  ]
}
