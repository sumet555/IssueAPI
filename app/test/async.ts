import * as async from 'async';

//ทำแบบบนลงล่าง ทำ fn หมดค่อยส่ง  result
async.waterfall([
    function(callback) {
        //callback(error,value)
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        console.log(arg1,arg2);
        callback("Error", 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
    console.log('error : ',err);
    console.log('result : ',result);
});
