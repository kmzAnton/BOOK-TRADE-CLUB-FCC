$('document').ready(function(){

  $('#findBook').click(function(e){

    var bookName = document.getElementsByName('bookName')[0].value.trim().split(' ').join('+');
    var authorName = document.getElementsByName('authorName')[0].value.trim().split(' ').join('+');
    
    var query = bookName+'+'+authorName; 
        
    var url = "https://www.googleapis.com/books/v1/volumes?q="+query;

    $.ajax({
      type:'GET',
      url: url,
      success:function(resp){

        var data = resp.items.slice(0,3);
        $('.searchResult').html('');
        
        data.forEach(item=>{
          
          var html = '';
          
          var name = item.volumeInfo.title,
              author = item.volumeInfo.authors.join(', '),
              short_desc = item.volumeInfo.description.slice(0,70),
              category = item.volumeInfo.categories.join(', '),
              image = item.volumeInfo.imageLinks.thumbnail,
              link = item.volumeInfo.infoLink,
              volumeId = item.id; 
          
          
          html+= '<div class="col-sm-4">';
          html+=   '<div class="card" id="'+volumeId+'">';
          html+=     '<div class="trade hidden"><i class="fa fa-3x fa-handshake"></i></div>';
          html+=     '<img class="card-img-top" src="'+image+'" alt="'+name+'">';
          html+=     '<div class="card-body">';
          html+=       '<h6 class="card-title"><b>Title:</b> '+name+'</h6>';
          html+=       '<p class="card-title"><b>Author:</b> '+author+'</p>';
          html+=       '<p class="card-text"><b>Description:</b> '+short_desc+'...</p>';
          html+=       '<p class="card-text"><b>Categoty:</b> '+category+'</p>';
          html+=       '<a href="'+link+'" target="_blank" class="btn btn-sm btn-primary"><i class="fa fa-info-circle"></i>   More</a>';
          html+=       '<a class="btn btn-sm btn-success add"><i class="fa fa-plus-circle"></i>   Add</a>';
          html+=     '</div>';
          html+=   '</div>';
          html+= '</div>';
          
          $('.searchResult').append(html);
          
        });
        
      }
    });
  });
  
  $('.searchResult').on('click', '.add', function(e){
    
    var volumeId = this.parentElement.parentElement.id;
    var it = this;

    $.ajax({
      type: 'POST',
      url: '/add_to_lib',
      data: {id:volumeId},
      success: function(resp){
        if(resp){
          alert(resp);
          if(resp=='Good'){
            $(e.target).children().removeClass('fa-plus-circle');
            $(e.target).children().addClass('fa-check-circle');
          }else{
            alert('response is BAD');  
          }
        }else{
          alert('Something is wrong');
        }
      }
    });
    // alert(volumeId);
  });
  
  $('.onTrade').click(function(e){
    if (e.target.innerText.trim()=="Trade")  {
      e.target.innerHTML = '<i class="fa fa-lg fa-check"></i>   on Trade';
    }else{
      e.target.innerHTML = '<i class="fa fa-lg fa-shopping-basket"></i>   Trade'
    }
  });
  
  
  
});