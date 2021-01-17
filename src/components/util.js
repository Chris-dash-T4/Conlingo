export function shuffle(array) {
  if (array==null) { return null; }
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function subset(a, obj) {
    var inv = []; //populate inverse of obj
    var j;//could work for up to 3? only doing sets of to so far at present so no biggie
    for (j=obj.length-1;j>=0;j--) {inv.push(obj[j]);}
    var i = a.length;
    while (i--) {
       if (arraysEqual(a[i],obj) || arraysEqual(a[i],inv)) {
           return i+1; //returning i yielded problems with returning false at i=0
       }
    }
    return false;
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}