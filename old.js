var d = document

function node(tag, attrs, children) {
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

function assign(el, obj) {
  if (typeof obj == 'undefined') {
    return render(node(el))
  }
  if (typeof el == 'string') {
    return render(node(el, obj))
  }
  var ren = render(obj)
  console.log(ren, ren.length)
  if (ren.length) {
    ren.forEach(function (r) { el.appendChild(r) })
    return el
  }
  console.log(el)
  el.appendChild(ren)
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

function text(parent, text) {
  parent.appendChild(d.createTextNode(text))
}

function setAttrs(el, attrs) {
  for (var k in attrs) {
    el.setAttribute(k, attrs[k])
  }
}

export {
  assign,
  parseSelector
}

// simple test:
// assign(document.body, node('h1', 'sandia'))
// assign(document.body, [node('h1[ottr=zzzz]', {title: 'titulo', id: 'title', class: 'sarasa'}, 'Hola'), node('h3', 'mundo')])
