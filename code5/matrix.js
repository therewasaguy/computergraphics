// [ x0, x1, x2, x3,   y0, y1, y2, y3,   z0, z1, z2, z3,   t0, t1, t2, t3 ];
var Matrix = function() {
  this.array = this.identity(); // initilize
};

// initialize the matrix
Matrix.prototype.identity = function() {
  return [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1];
}

Matrix.prototype.transformPoint = function(x, y, z_) {
  // z defaults to 1
  var z = z_ || 1;
  var m = this.array;
  var ret = [];
  for (var i = 0; i < m.length/4; i++) {
    // var innerProduct = dot([x, y, z], this.array.slice(i,i+4));
    var innerProduct = dot([x, y, z], [ m[i], m[i+4], m[i+8], m[i+12] ] );
    ret.push( innerProduct );
  }
  return ret;
}

// use only right column
Matrix.prototype.translate = function(x, y, z_) {
  // z defaults to 1
  var z = z_ || 1;
  var translateMatrix = this.array;
  translateMatrix[3] = x;
  translateMatrix[7] = y;
  translateMatrix[11] = z;

  this.array = translateMatrix;
};


Matrix.prototype.rotateX = function(theta) {
  // create a rotation matrix
  // multiply base matrix by rotationMatrix
  // first row, first column,
  
  var cos = Math.cos(theta), sin = Math.sin(theta);
  var m = this.array;
  m[5] = cos;
  m[6] = sin;
  m[9] = -sin;
  m[10] = cos;
  this.array = m;
  return m;
};


Matrix.prototype.rotateY = function(theta) {
   var cos = Math.cos(theta), sin = Math.sin(theta);
   var m = this.array;
   m[0] = cos;
   m[2] = -sin;
   m[8] = sin;
   m[10] = cos;
   this.array = m;
   return m;
};

Matrix.prototype.rotateZ = function(theta) {
   var cos = Math.cos(theta), sin = Math.sin(theta);
   var m = this.array;
   m[0] = cos;
   m[1] = sin;
   m[5] = -sin;
   m[6] = cos;
   this.array = m;
   return m;
};


Matrix.prototype.scale = function(x, y, z) {
   var m = this.array;
   m[0] = x;
   m[5] = y;
   m[10] = z;
   this.array = m;
   return m;
};


// arguments are vectors
Matrix.prototype.transform = function(vector) {
  var m = this.array;
  var ret = [];
  for (var j = 0; j < vector.length/4; j++) {
    for (var i = 0; i < m.length/4; i++) {
    // for (var i = 0; i < Math.ceil(vector.length/4)*4; i++) {
      // var innerProduct = dot([x, y, z], this.array.slice(i,i+4));
      var innerProduct = dot([vector[j], vector[j+4], vector[j+8], vector[j+12]], [ m[i], m[i+4], m[i+8], m[i+12] ] );
      ret.push( innerProduct );
    }
  }
  this.array = ret;
  return ret;
}

// helper methods
function dot(a,b) {
  var n = 0;
  var limit = Math.min(a.length,b.length);
  for (var i = 0; i < limit; i++) {
    n += a[i] * b[i];
  }
  return n;
}

function matrixMult(mat1, mat2) {
  var ret = [];
  var row, col;
  for (var i = 0; i < mat1.length/4; i++) {
    col = [ mat1[i], mat1[i+4], mat1[i+8], mat1[i+12] ];
    for (var j = 0; j < 4; j++) {
      row = [ mat2[i], mat2[i+1], mat2[i+2], mat2[i+3] ];
      ret.push( dot(row, col ));
    }
    // ret.push(dot(mat[i]))
  }
  return ret;
}