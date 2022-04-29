/*
  sendto.js
  
*/

var sendto = {
 
  anchor: null,
  
  init(){
    this.anchor = document.createElement('a')    // used to launch links
    this.anchor.style.display = 'none'
    this.anchor.target = '_blank'
    
    document.body.appendChild( this.anchor )
  },
  uninit(){
    document.body.removeChild( this.anchor )
    this.anchor = null
  },
  send( href ){
    this.anchor.href = encodeURI( href )
    this.anchor.click()
  },
  
  email( title, body ){ 
    let href = `mailto:?subject=${title}&body=${body}`
    this.send( href )
  },
  facebook( url, body ){
    let href= `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${body}`
    this.send( href ) 
  },
  linkedin( url, title, body ){
    let href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${body}&source=`
    this.send( href )
  },
  sms( body ){
    let href= `sms:&body=${body}` 
    this.send( href )    
  },
  twitter( body ){
    let href= `https://twitter.com/intent/tweet?text=${body}` 
    this.send( href )    
  },
  whatsapp( body ){
    let href= `https://wa.me/?text=${body}` 
    this.send( href )    
  }
  
}