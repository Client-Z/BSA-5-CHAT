(function(){
let userUl = document.getElementById("userList");
let userSubmit = document.getElementById("submitRegistration");
let nameInput = document.getElementById("userName");
let nickInput = document.getElementById("nickName");
let registration = document.getElementById("registration");
let messageContainer = document.createElement("div");
let messagelist = document.getElementById("messagelist");
let ajaxRequest = function(options){
    let url = options.url || "/";
    let method = options.method || "GET";
    let callback = options.callback || function(){};
    let data = options.data || {};
    let xmlHttp = new XMLHttpRequest();
    let ascyn = options.ascyn || true;
    let errorCb = options.errorCb || function(){};

    xmlHttp.open(method, url, ascyn);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(data));  
  

    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.status == 200 && xmlHttp.readyState === 4){
                 callback(xmlHttp.responseText);
        } else {
            errorCb(xmlHttp.responseText);
        }
    }

}

function checkStorrage(){
    
    if(sessionStorage.getItem("nickName")){
         registration.style.display="none";
    }
}

 function sendUserName(event) {
    
    var  data = {
        "userName": nameInput.value,
        "nickName": nickInput.value
    };
    console.log(nameInput.value.length);
    console.log(nickInput.value.length);
   
     if(/^[a-z]{4,15}$/.test(nameInput.value) && /^[a-z0-9_-]{3,15}$/.test(nickInput.value)) {
            ajaxRequest({
                method: "POST",
                url: "/users",
                data: data,
                callback: function(respone) {
                    if(respone === "OK"){
                    registration.style.display="none";
                   
                    
                    sessionStorage.userName = data.userName;
                    sessionStorage.nickName = data.nickName;
                    alert("Регистрация прошла успешно");
                   
                    } 
                },
                errorCb: function(respone){             
                         
                    
                    
                    nickInput.value = "";
                    nickInput.placeholder = `Sorry, User ${data.nickName} alredy exist!`;
                    nickInput.style.borderColor="red";
                    
                } 
                
                
            })
     }   
        
     if ( /^[a-z]{4,15}$/.test(nameInput.value)) { 
         nameInput.style.borderColor="green";
        
     } else {
         nameInput.style.borderColor="red";
     }

     if (/^[a-z0-9_-]{3,15}$/.test(nickInput.value)) {         
         nickInput.style.borderColor="green";
     } else {
         nickInput.style.borderColor="red";
     }
};        
 
function sendUserDataEvent(){
    
     userSubmit.addEventListener("click", sendUserName );
}

function sendMessage(event) {
    let text = document.getElementById("text");
    let date = new Date;
    let textSubmit = document.getElementById("textSubmit");
    var  data = {
        "userName": `${sessionStorage.getItem("userName")}`,
        "nickName": `${sessionStorage.getItem("nickName")}`,
        "text": text.value,
        "date": date
    };
    
    console.log(data.userName);
    console.log(data.nickName);
    console.log(data.text);
    console.log(data.date);
   
     if(text.value.length > 0) {
            ajaxRequest({
                method: "POST",
                url: "/messages",
                data: data,
                callback: function(respone) {
                    if(respone === "OK"){  
                                                  
                    } 
                }         
            })
     }   else {             
        
        text.style.borderColor = "red";
     }
      
   text.value = " ";
}; 
    
function sendMessageEvent(){
    
     textSubmit.addEventListener("click", sendMessage );
}
 
window.onload = () => {
   checkStorrage();
   sendMessageEvent();
   sendUserDataEvent();
   
   
   
   
}
 let getuUserData = function(){
     ajaxRequest({
         url: "/users",
         method: "GET",
         callback: function(users){
             users = JSON.parse(users);
             userUl.innerHTML = " ";
             for( var i in users){
                 if(users.hasOwnProperty(i)){
                     let li = document.createElement("li");
                     li.innerText = `${users[i].userName} (${users[i].nickName})`;
                     if(users[i].nickName === sessionStorage.getItem("nickName") ){
                         let span = document.createElement("span");
                         span.innerHTML ="Its you";
                         li.style.backgroundColor="#fff";
                         li.style.color="#000";
                         li.appendChild(span);
                     }
                     userUl.appendChild(li);
                 }
             }

         }
     })
 }

 let getMessageData = function(){
     ajaxRequest({
         url: "/messages",
         method: "GET",
         callback: function(messages){
             messages = JSON.parse(messages);
            messageContainer.innerHTML = " ";
             for( var i in messages){
                  
                 if(messages.hasOwnProperty(i)){
                     let block = document.createElement("div");
                     let nameSpan = document.createElement("span");
                     let dateSpan = document.createElement("span");
                     let text = document.createElement("p");                                        

                     
                     nameSpan.innerText = `${messages[i].userName} (${messages[i].nickName})`;
                     dateSpan.innerHTML = `${messages[i].date}`;
                     text.innerText = `${messages[i].text}`;

                     if(messages[i].text.includes(sessionStorage.getItem("nickName"))){
                      text.style.backgroundColor="rgba(52, 152, 219,0.3)";
                         
                     }
                    
                     block.appendChild(nameSpan);
                     block.appendChild(dateSpan);
                     block.appendChild(text);
                     messageContainer.appendChild(block);
                 }
                     
             }
                
            messagelist.appendChild(messageContainer);
            
             

         }
     })
 }
 setInterval(()=>{
     getuUserData();
     getMessageData();
 },1000);
   
})()