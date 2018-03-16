$('document').ready(function(){
  
  //BUTTONS HANDLERS
  
  $('#editBtn').click(function(e){
    
    document.getElementById('infoName').removeAttribute('readonly');
    document.getElementById('infoEmail').removeAttribute('readonly');
    document.getElementById('infoCity').removeAttribute('readonly');
    document.getElementById('infoRegion').removeAttribute('readonly');
    document.getElementById('infoCountry').removeAttribute('readonly');
    
    document.getElementById('editBtn').disabled = true;
    
    document.getElementById('saveBtn').classList.remove('hidden');
    
  });
  
  
  $('#saveBtn').click(function(e){

    var userInfo = {
      username: document.getElementById('infoName').value,
      email:document.getElementById('infoEmail').value,
      city: document.getElementById('infoCity').value,
      region: document.getElementById('infoRegion').value,
      country: document.getElementById('infoCountry').value,
    };
    
    $.ajax({
      url:'/edit_user_info',
      data: userInfo,
      type:'POST',
      success: function(resp){
        if(resp=="Good"){
          
          document.getElementById('saveBtn').classList.add('hidden');

          document.getElementById('infoName').readOnly = true;
          document.getElementById('infoEmail').readOnly = true;
          document.getElementById('infoCity').readOnly = true;
          document.getElementById('infoRegion').readOnly = true;
          document.getElementById('infoCountry').readOnly = true;
          
          document.getElementById('editBtn').disabled = false;
      
        }else{
          alert('Something does wrong');
        }
        
      }
    });
    
  });
  
  
  $('.onTrade').click(function(e){

    var trade = e.target.innerText.trim();
    var volumeId = e.target.parentElement.parentElement.id;
    var x = this;
    
    $.ajax({
      url: '/onTrade',
      data: {trade,volumeId},
      type:'POST',
      success: function(resp){
        if(resp=='Good'){
          if (e.target.innerText.trim()=="Trade")  {
            x.innerHTML = '<i class="fa fa-lg fa-check"></i>   on Trade';
            x.parentElement.parentElement.children[1].classList.remove('hidden');
          }else{
            x.innerHTML = '<i class="fa fa-lg fa-shopping-basket"></i>   Trade'
            x.parentElement.parentElement.children[4].classList.add('hidden');
          }
        }
      }
      
    });
    
  });
  
  
  $('.trade').click(function(e){
    
    var volumeId = this.parentElement.id; 
    // alert(volumeId);
    
    $.ajax({
      url: '/make_new_request',
      type:'POST',
      data: {volumeId},
      success: function(resp){
        if(resp=='Good'){
          alert('New request is created');
        }else{
          alert('onCreateReq: something goes wrong');
        }        
      }
    });
    
  });
  
  
  $('.yours').click(function(e){
    
    var parent = this.parentElement;
    var reqId = this.parentElement.id;
    // alert(reqId);
    
    $.ajax({
      url: '/delete_your_request',
      data: {reqId},
      type: 'POST',
      success: function(resp){
        if(resp=='Good'){
          alert('Request is removed');
          parent.remove();
        }else{
          alert('Something went wrong');
        }
      }
    });
    
  });
  
  
  $('.toYou_check').click(function(e){
    
    var x = this;
    var parent = this.parentElement;
    var reqId = parent.id;
    // alert(reqId);
    
    $.ajax({
      url:'/accept_request',
      data:{reqId},
      type: 'POST',
      success: function(resp){
        if(resp=='Good'){
          alert('Accepted');
          x.innerHTML='<i class="fa fa-lg fa-handshake green"></i>';
        }else{
          alert('Something went wrong, request is not removed');
        }
      }
    });
  });
  
  
});