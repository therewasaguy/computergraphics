// Thank you, Ken Perlin.

// [ x0, x1, x2, x3,   y0, y1, y2, y3,   z0, z1, z2, z3,   t0, t1, t2, t3 ];
var Matrix = function() {
  this.transforms = []; // array of transformations to compute during transformPoint
  this.array = this.transforms[0] = this.identity(); // initilize
};

Matrix.prototype.push = function(e) {
  this.transforms.push(e);
}

Matrix.prototype.pop = function() {
  this.transforms.pop();
}

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
  var m = this.identity();
  m[3] = x;
  m[7] = y;
  m[11] = z;
  this.transforms.push( matrixMult(this.array, m) );
};


Matrix.prototype.rotateX = function(theta) {
  // create a rotation matrix
  // multiply base matrix by rotationMatrix
  
  var cos = Math.cos(theta), sin = Math.sin(theta);
  var m = this.identity();
  m[5] = cos;
  m[6] = sin;
  m[9] = -sin;
  m[10] = cos;
  this.transforms.push( matrixMult(this.array, m) );
  // this.array = matrixMult(this.array, m);
  // return m;
};


Matrix.prototype.rotateY = function(theta) {
  var cos = Math.cos(theta), sin = Math.sin(theta);
  var m = [1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1];
  // m[0] = cos;
  // m[2] = -sin;
  // m[8] = sin;
  // m[10] = cos;
  // this.array = m;
  // this.array = matrixMult(this.array, m);
  this.transforms.push( matrixMult(this.array, m) );

  // return m;
};

Matrix.prototype.rotateZ = function(theta) {
  var cos = Math.cos(theta), sin = Math.sin(theta);
  var m = this.identity();
  m[0] = cos;
  m[1] = sin;
  m[4] = -sin;
  m[5] = cos;
  // this.array = matrixMult(this.array, m);
  // this.array = m;
  // return m;
  this.array = matrixMult(this.array, m);

  // this.transforms.push( matrixMult(this.array, m) );

};


Matrix.prototype.scale = function(x, y, z) {
  if (typeof y == 'undefined') z = y = x;
  var m = this.identity();
  m[0] = x;
  m[5] = y;
  m[10] = z;
  // this.array = m;
  this.transforms.push( matrixMult(this.array, m) );
  // return m;
};


// arguments are vectors
Matrix.prototype.transform = function(vector) {
   // var x = dot( [M[0],M[4],M[ 8],M[12]] , v );
   // var y = dot( [M[1],M[5],M[ 9],M[13]] , v );
   // var z = dot( [M[2],M[6],M[10],M[14]] , v );
   // var w = dot( [M[3],M[7],M[11],M[15]] , v );
   // return v.length == 4 ? [x, y, z, w] : [x / w, y / w, z / w];

   var m = this.array;
   var ret = [];
   for (var i = 0; i < m.length/4; i++ ) {
    var theDot = dot( [ m[i], m[i+4], m[i+8], m[i+12] ], vector );
    ret.push(theDot);
   }
   return ret;
  // var m = this.array;
  // var ret = [];
  // // for (var j = 0; j < vector.length/4; j++) {
  // for (var i = 0; i < m.length/4; i++) {
  //   // for (var i = 0; i < Math.ceil(vector.length/4)*4; i++) {
  //     // var innerProduct = dot([x, y, z], this.array.slice(i,i+4));
  //   var innerProduct = dot([ m[i], m[i+4], m[i+8], m[i+12] ], vector );
  //   ret.push( innerProduct );
  //   // }
  // }
  // // this.array = matrixMult(this.array, ret);
  // return ret;
}


function matrixMult(m1, m2) {
  var ret = [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1];
  var row, col;
  m2 = transpose(m2);
  return [
  dot(getX(m1), getX(m2)), dot(getX(m1), getY(m2)), dot(getX(m1), getZ(m2)), dot(getX(m1), getW(m2)),
  dot(getY(m1), getX(m2)), dot(getY(m1), getY(m2)), dot(getY(m1), getZ(m2)), dot(getY(m1), getW(m2)),
  dot(getZ(m1), getX(m2)), dot(getZ(m1), getY(m2)), dot(getZ(m1), getZ(m2)), dot(getZ(m1), getW(m2)),
  dot(getW(m1), getX(m2)), dot(getW(m1), getY(m2)), dot(getW(m1), getZ(m2)), dot(getW(m1), getW(m2)) ];
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

function getX(m) {
  return [m[0], m[1], m[2], m[3]];
}

function getY(m) {
  return [m[4], m[5], m[6], m[7]];
}

function getZ(m) {
  return [m[8], m[9], m[10], m[11]];
}

function getW(m) {
  return [m[12], m[13], m[14], m[15]];
}

// swap rows and columns
function transpose(m) {
  return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
}