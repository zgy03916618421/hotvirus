/**
 * Created by Administrator on 2016/9/21.
 */
var md5 = require('MD5')
var underscore = require('underscore')
var ObjectID = require('mongodb').ObjectID
var redisTemplate = require('../db/redisTemplate');
exports.getVirus = function *(userid) {
    var total = yield mongodb.collection('order').find().toArray();
    var orders = underscore.filter(total,function (data) {
        if(data.speed){
            return data.fullfill < 16;
        }else{
            return data.fullfill < 4;
        }

    })
    if (!orders.length){
        var data = {'head':{code: 1000,msg:'no virus'}};
        return data
    }else{
        var user = yield  mongodb.collection('infected').find({"infectid":userid}).toArray();
        var Ovids = [];
        var Uvids = [];
        orders.forEach(function (value,index,arry) {
            Ovids.push(value.vid);
        })
        user.forEach(function (value,index,arry) {
            if(value.vid !== undefined){
                Uvids.push(value.vid);
            }
        })
        var virusids = underscore.difference(Ovids,Uvids);
        if(virusids.length){
            var virusid = underscore.sample(virusids);
            var order = yield mongodb.collection('order').find({'vid':virusid}).toArray();
            var selectOrder = underscore.sample(order);
            var doc = selectOrder;
            yield mongodb.collection('order').updateOne({'orderid':doc.orderid},{$set:{'fullfill':doc.fullfill+1}});
            yield mongodb.collection('infected').insertOne({'carryid':doc.userid,'vid':virusid,'infectid':userid,'orderid':doc.orderid,'createtime':Date.parse(new Date())});
            var virus = yield mongodb.collection('virus').find({'vid':virusid}).toArray();
            var userinfo = yield mongodb.collection('user').find({'openid':virus[0].userid}).toArray();
            var patients = yield mongodb.collection('infected').find({'vid':virusid}).toArray();
            var favor = yield mongodb.collection('action').find({'vid':virusid,'action':'spread'}).toArray();
            var favorCount = favor.length;
            var patientNumber = patients.length;
            var data ={};
            //  data.order = doc
            data.virus = virus[0];
            data.userinfo = userinfo[0];
            data.patientNumber = patientNumber;
            data.favorCount = favorCount;
            return {'head':{code:200,msg:'success'},'data':data};
        }else{
            return {'head':{code: 1000,msg:'no virus'}};
        }
    }
}
exports.favor = function *(userid,vid,speed) {
    var doc = {};
    doc.orderid = md5(new Date().valueOf()+Math.random());
    doc.userid = userid;
    doc.vid = vid;
    doc.fullfill = 0 ;
    doc.speed = speed;
    doc.createtime = Date.parse(new Date());
    doc.rnd = Math.random();
    yield mongodb.collection('order').insertOne(doc);
    yield mongodb.collection('action').insertOne({'userid':userid,'vid':vid,'action':'spread','createtime':Date.parse(new Date())});
}
exports.disfavor = function *(userid,vid) {
    yield mongodb.collection('action').insertOne({'userid':userid,'vid':vid,'action':'skip','createtime':Date.parse(new Date())});
}
exports.recharge = function *(money,userid) {
    yield mongodb.collection('user').updateOne({'openid':userid},{$inc:{'balance':money*10}});
    var user = yield mongodb.collection('user').find({'openid':userid}).toArray();
    yield mongodb.collection('deallog').insertOne({'userid':userid,'price':money,'createtime':Date.parse(new Date())});
    return user[0].balance;
}
exports.share = function *(userid) {
    var shareCount = parseInt(yield redisTemplate.get('share'));
    console.log(shareCount);
    yield mongodb.collection('user').updateOne({'openid':userid},{$inc:{'balance':shareCount}});
}
exports.actionLog = function *(vid) {

}
exports.getVirusV2 = function *(userid) {
    var infects = yield mongodb.collection('infected').find({$or: [{infectid: userid}, {carryid: userid}]},{vid:1}).toArray();
    var ifs = infects.map(function (doc) {
        return doc.vid;
    })
    var order = yield mongodb.collection('order').findOne({$and: [{vid: {$nin: ifs}},
        {$or: [{$and: [{speed: true}, {fullfill: {$lt: 16}}]},
            {$and: [{speed: false}, {fullfill: {$lt: 4}}]}
        ]}]}
    );

    if (!order){
        var data = {'head':{code: 1000,msg:'no virus'}};
        return data
    }else{
       yield mongodb.collection('order').updateOne({'orderid':order.orderid},{$inc:{'fullfill':1}});
        console.log('1');
       yield mongodb.collection('infected').insertOne({'carryid':order.userid,'vid':order.vid,'infectid':userid,'orderid':order.orderid,'createtime':Date.parse(new Date())});
        console.log('2');
        var virus = yield mongodb.collection('virus').findOne({'vid':order.vid});
        console.log('3');
        var userinfo = yield mongodb.collection('user').findOne({'openid':virus.userid});
        console.log('4');
        //var patients = yield mongodb.collection('infected').find({'vid':order.vid}).toArray();
        var patients = yield mongodb.collection('infected').aggregate([
            {$match:{"vid":order.vid}},
            {$group:{"_id":null,"count":{$sum:1}}}
        ]).toArray();
        var favor = yield mongodb.collection('action').find({'vid':order.vid,'action':'spread'}).toArray();

        var data ={};
        data.virus = virus;
        data.userinfo = userinfo;
        data.patientNumber = patients[0].count;
        data.favorCount = favor.length;
        return {'head':{code:200,msg:'success'},'data':data};
    }
}
exports.speedV4 = function *(vid,userid) {
    var user = yield mongodb.collection('user').findOne({'openid':userid});
    if(user.balance < 100){
        return {'head':{code:600,msg:'no balance'},'data':{balance:user.balance}};
    }else{
        mongodb.collection('user').updateOne({'openid':userid},{$inc:{'balance':-100}});
        var time = Date.parse(new Date());
        var users = yield mongodb.collection('order').find({$and:[{vid:vid},{speed:true},{createtime:{$lt:time}}]},{userid:1}).toArray();
        var us = users.map(function (doc) {
            return doc.userid;
        })
        var source = yield mongodb.collection('virus').findOne({'vid':vid});
        if(us.length){
            yield mongodb.collection('user').updateMany({'openid':{$in:us}},{$inc:{'income':parseInt(50/(users.length)),'balance':parseInt(50/(users.length))}});
            yield mongodb.collection('user').updateOne({'openid':source.userid},{$inc:{'income':50,'balance':50}});
        }else{
            yield mongodb.collection('user').updateOne({'openid':source.userid},{$inc:{'income':100,'balance':100}});
        }

    }
}
exports.tree = function *(vid) {
    var data = yield mongodb.collection('infected').aggregate([
        {$match:{'vid':vid}},
        {$project:{'name':"$infectid",'parent':'$carryid','_id':0}}
    ]).toArray();
    var data1 = data.map(function (item) {
        if(item.name==item.parent){
            delete  item.parent
        }
    })
    var dataMap = data.reduce(function(map, node) {
        map[node.name] = node;
        return map;
    }, {});
    var treeData = [];
    for(var i =0;i <data.length; i ++){
        var parent = dataMap[data[i].parent];
        if (parent) {
            // create child array if it doesn't exist
            (parent.children || (parent.children = []))
            // add node to child array
                .push(data[i]);
        } else {
            // parent is null or missing
            treeData.push(data[i]);
        }
    }
    return treeData;
    
}
exports.getshareVirus = function *(carryid,vid,userid) {
    var virus = yield mongodb.collection('virus').findOne({'vid':vid});
    var userinfo = yield mongodb.collection('user').findOne({'openid':virus.userid});
    var patients = yield mongodb.collection('infected').find({'vid':vid}).toArray();
    var favor = yield mongodb.collection('action').find({'vid':vid,'action':'spread'}).toArray();
    var carry = yield mongodb.collection('user').findOne({'_id':ObjectID.createFromHexString(carryid)})
    mongodb.collection('shareinfected').insertOne({'carryid':carry.openid,'vid':vid,'infectid':userid,'createtime':Date.parse(new Date())});
    var data = {};
    data.virus = virus;
    data.userinfo = userinfo;
    data.patientNumber = patients.length;
    data.favorCount = favor.length;
    return {'head':{code:200,msg:'success'},'data':data};
}
exports.graph = function *(vid) {
    var edges = yield mongodb.collection('shareinfected').aggregate([
        {$match:{'vid':vid}}
    ]).toArray();
    var data =[];
    for (var i =0; i<edges.length;i++){
        var edge = {};
        var carryid = edges[i].carryid;
        var infectid = edges[i].infectid;
        var carry = yield mongodb.collection('user').findOne({'openid':carryid});
        var infect = yield mongodb.collection('user').findOne({'openid':infectid});
        edge.source=carry.nickname;
        edge.target= infect.nickname;
        edge.label = vid;
        data.push(edge);
    }
    return data;
}
exports.hotvirus = function *(limit) {
    var vids = yield mongodb.collection('action').aggregate([
        {$match:{action:"spread"}},
        {$group:{_id:{vid:"$vid"},count:{$sum:1}}},
        {$sort:{count:-1}},
        {$limit:limit},
        {$project:{vid:"$_id.vid",count:1,_id:0}}
    ]).toArray();
    return vids;
}
exports.getVirusById = function *(vid) {
    var virus = yield mongodb.collection('virus').findOne({'vid':vid});
    return virus;
}