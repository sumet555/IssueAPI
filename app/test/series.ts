import * as async from 'async';

//ทำแบบบนลงล่าง ไม่ต้องต่อเนื่องกัน จะไม่ส่งค่าจะ fn 1 ไป 2 ส่งไปตัวสุดท้าย ทำ fn เสร็จแล้วส่ง  result ไป เลย
async.series([
    function(callback) {
        // do some stuff ...
        callback(null, 'one');
    },
    function(callback) {
        // do some more stuff ...
        callback('ERROR', 'two');
    },
    function(callback) {
        // do some more stuff ...
        callback(null, 'three');
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
    console.log('error',err);
    console.log('result',results);
});