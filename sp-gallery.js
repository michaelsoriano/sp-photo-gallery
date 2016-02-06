var gallery = function(list){
  
  var webUrl = _spPageContextInfo.webAbsoluteUrl; 
  var listName = list;
  var limit = 20; 
  var skip = 0;
  var total = 0;
 
  
  var init = function(){     
      var ajax1 = getListCount(webUrl,listName);
      var ajax2 = getListItems(webUrl,listName, null);
            
      ajax1.done(function(data){
        total = data;
        if(total <= limit){
          $('#showmore').hide();
        }
      });      
      ajax2.done(function(data){
        buildGallery(data);
      });
  }
  
  
  var showmore = function (){
      
      $('#showmore').addClass('fetching').html('Loading images...');
      
      skip = skip+limit;
      var ajax2 = getListItems(webUrl,listName, null);
      ajax2.done(function(data){
        buildGallery(data);
        $('#showmore').removeClass('fetching').html('Show More');
        if($('.thumbnail-wrap').length >= total){
            $('#showmore').hide();
        }        
      });   
      return false;
  }
  
  
  var buildGallery = function(data){
        
      var source   = $("#photogallery").html();
      var template = Handlebars.compile(source);   
      $('.photo-gallery-wrap').append(template(data));
      
      $('.popup').magnificPopup({
          type: 'image',
          gallery:{
            preload: [0,5],
            enabled:true
          }, 
          removalDelay: 300,
          mainClass: 'mfp-fade'
      });
  }  

  function getListCount(webUrl,listName) {      
    var url = webUrl + "/_vti_bin/listdata.svc/" + listName + '/$count'; 
    var ajax = $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose,text/plain" },
        error: function (data) {
          console.log('error in fetching list count');
          console.log(data.responseJSON.error);
        }
    });    
    return ajax;    
  }
  
  
  function getListItems(webUrl,listName, itemId) {        
    
    var url = webUrl + "/_vti_bin/listdata.svc/" + listName;    
    if(itemId !== null){
      url += "(" + itemId + ")";
    }        
    url += '?$top='+limit+'&$skip='+skip;
        
    var ajax = $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },        
        error: function (data) {
          console.log(data.responseJSON.error);
        }
    });    
    return ajax;    
  }
    
  return {
    init : init,
    showmore : showmore,
    buildGallery : buildGallery
  }
}

Handlebars.registerHelper('findGroup', function(data) {  
    var remove = _spPageContextInfo.webServerRelativeUrl;
    var str = data.Path; 
    return str.replace(remove+'/','');
});

Handlebars.registerHelper('imgSrc', function(data) {  
    var url = _spPageContextInfo.siteAbsoluteUrl;
    url += data.Path; 
    url += '/' + data.Name
    return url;
});

Handlebars.registerHelper('imgSrcThumb', function(data) {  
  
    var thumb = data.Name; 
    thumb = thumb.replace('.jpg', '_jpg.jpg');
      
    var url = _spPageContextInfo.siteAbsoluteUrl;
    url += data.Path; 
    url += '/_t/' + thumb;
    return url;
});