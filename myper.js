// r('h1')
// r('h1', 'titulo')
// r(document.body, 'h1')
// r('h1', {onclick:sandia()}, 'titulo')
// r(document.body, 'h1', 'titulo')
// r('h1', {onclick:sandia()}, 'titulo')
// r(document.body, 'h1', {onclick:sandia()}, 'titulo')

var d = document
// overriding in js does not exists :(k
function myper() {
  var argv = arguments
  var argc = argv.length
  if (argc == 0) return
  if (argc == 1) return createNode(argv[0])
  if (argc == 2) {
    if (typeof argv[0] == 'string') return createNode(argv[0], argv[1])
    if (argv[1].tag) {
      append(argv[0],argv[1])
      return argv[0]
    }
    append(argv[0], myper(argv[1]))
    return argv[0]
  }
  if (argc == 3) {
    if (typeof argv[0] == 'string') return createNode(argv[0], argv[1], argv[2])
    append(argv[0], myper(argv[1], argv[2]))
    return argv[0]
  }
  return append(argv[0], myper(argv[1], argv[2], argv[3]))
}

function createNode(tag, attrs, children) {
  // @TODO consider to user arguments for optional args like function myper
  var obj = parseSelector(tag)
  // attrs optional
  if (typeof children == 'undefined') {
    if (typeof attrs == 'undefined') {
      return obj
    }
    children = attrs
  } else {
    if (obj.attrs) {
      Object.assign(obj.attrs, attrs)
    } else {
      obj.attrs = attrs
    }
  }
  obj.children = children
  return obj
}

function render(obj) {
  if (typeof obj == 'string') {
    return render(node(obj))
  }
  var el = d.createElement(obj.tag)
  if (obj.attrs) {
    setAttrs(el, obj.attrs)
  }
  if (typeof obj.children == 'string') {
    text(el, obj.children)
    return el
  }
  if (obj.length) { // suppose array
    return obj.map(function (o) { return render(o) })
  }
  if (obj.children && obj.children.forEach) {
    obj.children.forEach(function (child) {
      if (typeof child == 'object') {
        el.appendChild(render(child))
      } else {
        text(el, child)
      }
    })
  }
  return el
}

function parseSelector(def) {
  var first = def.substr(0, 1)
  var regName = /[_a-zA-Z]+[_a-zA-Z0-9-]*/
  var regAttr = /\[[a-zA-Z0-9\.\-@_={}'":;\,]+\]/g
  var tag = def.match(regName)
  var attrs  = def.match(regAttr)
  var className = def.split('.').slice(1).join(' ')
  var obj = {
  }

  if (tag) {
    obj.tag = tag[0]
  }
  if (first == '#') {
    obj.id = obj.tag.substr(1)
    obj.tag = 'div'
  }
  if (first == '.') {
    obj.tag = 'div'
  }

  if (className) {
    obj.class = className
  }

  if (attrs) {
    obj.attrs = {}
    for (var i = 0, l = attrs.length; i < l; i++) {
      var sp = attrs[i].substr(1, attrs[i].length-2).split('=')
      var key = sp[0]
      var val = ''
      if (sp.length > 1) {
        val = sp.slice(1).join('=')
      }
      obj.attrs[key] = val
    }
  }
  return obj
}

function append(parent, node) {
  parent.appendChild(render(node))
}

function text(parent, text) {
  parent.appendChild(d.createTextNode(text))
}

export default myper
