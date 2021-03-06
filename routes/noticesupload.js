/**
 * Created by raghavrastogi on 09/07/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
var path = require('path');
var notice = require('../models/notice');

router.get('/', function (req, res, next) {
    res.render('noticeupload',{username:req.decoded.username});

});

router.post('/', function (req, res, next) {
    // console.log(req.body);
    if (req.query.token || req.headers['x-access-token']) {

        if (req.body.type == "image" || req.body.type == "video") {

            //console.log(req.files);
            old_path = "public/uploads/" + req.files.fil.name;
            new_path = "public/uploads/" + req.body.type + "/" + req.files.fil.originalname;
            //console.log(new_path);
            fs.rename(old_path, new_path, function (err) {
                if (err) {
                    res.json({err: err});
                }
                else {
                    notice.storeNotices(req, function (err, notice) {
                        if (err) {
                            console.log("errrrrrrrr",err);
                            res.json({msg: err});
                        }
                        else {
                            console.log("jdhakjhejkahekjhjkehakj");
                            res.json({msg: "Notice uploaded successfully"});
                        }
                    });
                }
            });
        }

        else {
            //uploading only text notices
            if (req.body.type == "text") {
                notice.storeNotices(req, function (err,notice) {
                    if (err) {
                        res.json({err: err});
                    }
                    else {
                        res.json({msg: "Notice uploaded successfully"});
                    }
                });
            }
        }


    }
    else {
        res.json({msg: "token not valid or expired"});
    }

});

module.exports = router;