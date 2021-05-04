

var express = require("express");
var router = express.Router();
var fs = require('fs');

const fileUpload = require('express-fileupload');
const { parse } = require('fast-csv');
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var new_zip =require("jszip");
var AdmZip = require('adm-zip');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
var Cookies=require('js-cookie')
router.use(fileUpload());

// Testing the API
router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

// API to add new files
router.post("/files",function(req,res,next){

  const { v4: uuidv4 } = require('uuid');
  var filename='content.txt'

  filename=req.cookies.filename;

  // if file exists for same user (known by cookie) delete it and use new file
    if(fs.existsSync(filename))
      {    
      
        fs.unlinkSync(filename);
      }

  // create unique filename
    filename=uuidv4();

  // unzip and read all entries
    var zip = new AdmZip(req.files.files.data);
    var zipEntries = zip.getEntries();
    console.log(zipEntries.length);
    var datet={}
    var tList = [];
  
    zipEntries.forEach((entry) => {
 
      fs.writeFile(filename, zip.readAsText(entry),{ flag: 'a+' }, err => {
    
          if (err) {
            console.error(err)
            return
          }
          //file written successfully
        })
 
  });
  
  // from extracted file read all Time and hours to populate first widget
  fs.createReadStream(filename)
  .pipe(parse({ delimiter: '\t' }))
  .on('data', (r) => {
     
      if(r[2]!=undefined && r[2].includes('DATETIME')){
          var key=r[2].replace('DATETIME=','');
          var datetimekey=r[2].replace('DATETIME=','')+' '+r[3];
          var datekey=new Date(datetimekey);
          var date_and_hour=key+' '+datekey.getHours();
          
      if(datet[date_and_hour]!=undefined)
              {
                  datet[date_and_hour] =datet[date_and_hour]+1;
              }
      else
              {
                  datet[date_and_hour]=1;
              }
      }    
  })
  .on('end', () => {
  
  // from extracted file read all Time and hours to populate first widget and push it into Array
    for(var tKey in datet) {
        var keyarray=tKey.split(' ');
         
        var datelocal=new Date(keyarray[0]);
        tList.push({datekey:keyarray[0],year:datelocal.getFullYear(),month: monthNames[datelocal.getMonth()],date:datelocal.getDate(), hour:keyarray[1], activities: datet[tKey]});
    }

    // sort the output of the dictionary
      tList=tList.sort(function(a,b){
      return a.date-b.date;
      }
    );
    
    // send response along with Cookie with filename
    var jsonObj=JSON.stringify(tList);
    res.cookie('filename',filename,{
      maxAge:60*60*1000,
     
      secure:true,
      sameSite:true,

    });
    res.send(jsonObj);
   
  })
});


router.post("/topfilenames",function(req,res,next){

   var filenames={}
   var tList = [];
   var date=req.body.date;
   var month=req.body.month;
   var year=req.body.year;
   var filename=req.body.filename;
   
  // from Cookie, we know the filename. For the given condition, populate top 5 files
    fs.createReadStream(filename)
    .pipe(parse({ delimiter: '\t' }))
    .on('data', (r) => {
        if(r[1]!=undefined &&r[2]!=undefined&& r[2].includes(year)){
            var file_name=r[1].replace('OBJECT_NAME=','');
            var datetime=r[2].replace('DATETIME=','')
            var datetimekey=datetime+' '+r[3];
            var datekey=new Date(datetimekey);
            if(datekey.getMonth()==month&&datekey.getFullYear()==year){
                if(date!=undefined && datekey.getDate()==date)
                {
                
                  var filename_date=file_name;
            
                  if(filenames[filename_date]!=undefined)
                      {
                        filenames[filename_date] =filenames[filename_date]+1;
                    
                      }
                  else
                      {
                        filenames[filename_date]=1;
                      
                      }
                }
                else if(date==undefined)
                {
                  
                
                  var filename_month=file_name;
            
                      if(filenames[filename_month]!=undefined)
                          {
                            filenames[filename_month] =filenames[filename_month]+1;
                        
                          }
                      else
                          {
                            filenames[filename_month]=1;
                          
                          }
                }
            
  
        }    
      }
    })
    .on('end', () => {

    
          for(var tKey in filenames) {
    
              tList.push({filename:tKey, activities: filenames[tKey]});
          }
  
      // descending sort and only send top 5 records
      tList=tList.sort(function(a,b){
          return b.activities-a.activities;
          }
      ).slice(0,5);
      var jsonObj=JSON.stringify(tList);
      
      res.send(jsonObj);
    

      
    })
  


});

router.post("/topusernames",function(req,res,next){

    var filenames={}
    var tList = [];
    var date=req.body.date;
    var month=req.body.month;
    var year=req.body.year;
    var filename=req.body.filename;

    fs.createReadStream(filename)
    .pipe(parse({ delimiter: '\t' }))
    .on('data', (r) => {
        for( i=0;i<r.length;i++)
       {
           if(r[i].includes('USER_NAME') && r[2]!=undefined)
           {

          
                var username=r[i].replace('USER_NAME=','');
                var datetime=r[2].replace('DATETIME=','')
                var datetimekey=datetime+' '+r[3];
                var datekey=new Date(datetimekey);
                if(datekey.getMonth()==month &&datekey.getFullYear()==year){
                    if(date!=undefined && datekey.getDate()==date)
                    {
                     
                      var user_date=username;
                
                      if(filenames[user_date]!=undefined)
                          {
                            filenames[user_date] =filenames[user_date]+1;
                         
                          }
                      else
                          {
                            filenames[user_date]=1;
                           
                          }
                    }
                    else if(date==undefined)
                    {
                      
                     
                      var user_month=username;
                
                          if(filenames[user_month]!=undefined)
                              {
                                filenames[user_month] =filenames[user_month]+1;
                             
                              }
                          else
                              {
                                filenames[user_month]=1;
                               
                              }
                    }
                
       
            }    
   
           }
       }
      
    })
    .on('end', () => {

          for(var tKey in filenames) {
              tList.push({username:tKey, activities: filenames[tKey]});
          }
    
      // descending sort and only send top 5 records
      tList=tList.sort(function(a,b){
          return b.activities-a.activities;
          }
      ).slice(0,5);
      var jsonObj=JSON.stringify(tList);
      console.log(jsonObj);
      res.send(jsonObj);
      
  
        
    })
   
 
 
 });
 

module.exports = router;