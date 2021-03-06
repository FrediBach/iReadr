var bookScroll;
var bookSlug;

function bookCreate() {
  /*Set genaral variables*/
  var doc = document,
      isIPhone = (/iphone/gi).test(navigator.appVersion),
      isIPad = (/ipad/gi).test(navigator.appVersion),
      density = window.devicePixelRatio,
      orientation = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait',
      standalone = ( ("standalone" in window.navigator) && window.navigator.standalone );
  
  /*Set genaral elements*/
  var wrapper = doc.getElementById('wrapper'),
      scroller = wrapper.children[0],
      bookMain = scroller.children[0], /* doc.getElementById('book0') */
      bookFooter = doc.getElementById('bookfooter'),
      totPages = doc.getElementById('totpages'),
      pagenumber = doc.getElementById('page'),
      bookmark = doc.getElementById('bookmark'),
      indicator = doc.getElementById('indicator'),
      footer = doc.getElementById('footer'),
      loading = doc.getElementById('loading');
  
  loading.style.display = "block";
  
  if (typeof store.get(bookSlug + '-size') !== 'undefined') {
    var size = store.get(bookSlug + '-size') * ( (isIPad) ? 1.5 : 1 ) + '%';
    bookMain.style.fontSize = size;
    doc.getElementById('title').style.fontSize = size;
    doc.getElementById('author').style.fontSize = size;
  }
  
  if (typeof store.get(bookSlug + '-style') !== 'undefined') {
    var bookStyle = store.get(bookSlug + '-style');
    // alert(bookStyle);
    doc.getElementById('book').style.backgroundColor = designs[bookStyle].bgcolor;
    bookMain.style.fontFamily = designs[bookStyle].fontfamily;
    bookMain.style.color = designs[bookStyle].color;
    bookMain.style.fontSize = designs[bookStyle].fontsize;
    bookMain.style.lineHeight = designs[bookStyle].lineheight;
    footer.style.color = designs[bookStyle].footer;
    doc.getElementById('title').style.fontSize = designs[bookStyle].titlefontsize;
    doc.getElementById('author').style.fontSize = designs[bookStyle].authorfontsize;
    doc.getElementById('aa').style.color = designs[bookStyle].aa;
    doc.getElementById('logolink').style.color = designs[bookStyle].logolink;
  }
  
  [].slice.apply(scroller.querySelectorAll('.pages.added')).forEach(function(element){
    element.parentNode.removeChild(element);
  });
  
  /*Set genaral elements*/
  var screenHeight = ( orientation === 'portrait' ) ? 510 : 300,
      barsHeight = 0;
  
  if(isIPhone) {
    barsHeight = standalone ? 10 : 50;
    screenHeight = ( orientation === 'portrait' ) ? 480 : 340;
  }
  
  if(isIPad) {
    barsHeight = standalone ? 25 : 70;
    screenHeight = ( orientation === 'portrait' ) ? 1024 : 768;
    bookMain.style.lineHeight = '40px';
    doc.getElementById('title').style.lineHeight = '40px';
    doc.getElementById('author').style.lineHeight = '40px';
  }
  
  var screenWidth = wrapper.offsetWidth,
      headerHeight = doc.getElementById('header').offsetHeight,
      footerHeight = doc.getElementById('footer').offsetHeight,
      
      lineHeight = doc.defaultView.getComputedStyle(bookMain,null).getPropertyValue('line-height').replace(/px$/, '') | 0,
      bookHeight = bookMain.scrollHeight, // offsetHeight
      
      spaceHeight = Math.floor( (screenHeight - headerHeight - footerHeight - barsHeight) / lineHeight ) * lineHeight,
      numPages = Math.ceil( bookHeight / spaceHeight ),
      bookFooterHeight = spaceHeight * numPages - bookHeight + lineHeight,
      
      debug = false;

  // wrapper.style.width = screenWidth + "px";
  bookMain.style.width = screenWidth + "px";
  bookMain.style.height = spaceHeight + "px";
  bookFooter.style.height = bookFooterHeight + "px";
  scroller.style.height = spaceHeight + "px";
  scroller.style.width = screenWidth * numPages + "px";
  totPages.innerHTML = numPages,
  indicatorStep = (doc.defaultView.getComputedStyle(indicator,null).getPropertyValue('width').replace(/px$/, '') | 0) / numPages;
  
  if (typeof bookScroll === 'object') {
    bookScroll.refresh();
  }
  else {
    var bookScroll = new iScroll('wrapper', {
      snap: true,
      momentum: false,
      hScrollbar: false,
      vScrollbar: false,
      //onScrollStart: function () { //pagenumber.innerHTML = this.dirX; },
      //onBeforeScrollMove: function() { //totPages.innerHTML = this.dirX; },
      onScrollEnd: function () {
        pagenumber.innerHTML = this.currPageX + 1;
        store.set(bookSlug + '-page', this.currPageX);
        indicator.children[0].style.left = Math.floor(indicatorStep * this.currPageX) + "px";
        window.currPage = this.currPageX;
      
        if (store.get(bookSlug + '-bookmark') === this.currPageX) {
          bookmark.setAttribute("class", "active");
        }
        else {
          bookmark.setAttribute("class", "");
        }
      }
    });
  }
  
  for (i = 1; i < numPages; i++) {
    var clone = bookMain.cloneNode(true);
    var page = bookMain.parentNode.appendChild(clone);
    page.id = "book"+i;
    page.className = "pages added";
    page.style.height = spaceHeight + "px";
    page.style.width = screenWidth + "px";
    page.scrollTop = spaceHeight * i;
  }
  
  if (store.get(bookSlug + '-page')) {
    bookScroll.scrollToPage( store.get(bookSlug + '-page') , 0, 1);
  }
  else {
    bookScroll.scrollToPage(0, 0, 1);
  }
  
  setTimeout( scroll, 200 );
  setTimeout( function() { loading.style.display = "none"; }, 500 );
  

return true;
};

function setBook() {
  if ((/iphone|ipad|android/gi).test(navigator.appVersion)) {
    setTimeout(bookCreate, 10);
  }
  else {
    document.getElementById('footer').style.display = "none";
  }
}

function scroll() {
  window.scrollTo(0,1);
}

function slugify(text) {
  text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
  text = text.replace(/-/gi, "_");
  text = text.replace(/\s/gi, "-");
  return text;
}

var log = (function() {
  return {  error : function(msg) { document.getElementById('errorOutput').appendChild(document.createElement('div')).innerHTML = msg } }
})();

window.onload = function() {
  var title = document.getElementById('title');
  var styles = document.getElementById('styles');
  var loading = document.getElementById('loading');
  
  document.title = title.innerHTML;
  bookSlug = slugify(title.innerHTML) + 'f';
  
  var bookmark = document.getElementById('bookmark'),
      style = document.getElementById('style'),
      aa = document.getElementById('aa'),
      styles = document.getElementById('styles');
  
  if ((/android/gi).test(navigator.appVersion)) {
    style.style.display = "none";
    aa.style.display = "none";
  }
  
  setBook();
  
  bookmark.addEventListener('touchstart', function (e){
    e.preventDefault();
    var bookmarkclass = bookmark.getAttribute("class");
    if (bookmarkclass === 'active') {
      store.set(bookSlug + '-bookmark', '');
      bookmark.setAttribute("class", "");
    }
    else {
      store.set(bookSlug+'-bookmark', window.currPage);
      bookmark.setAttribute("class", "active");
    }
    return false;
  }, false);
  
  aa.addEventListener('touchstart', function (e){
    e.preventDefault();
    if( styles.style.display === "block") {
      styles.style.display = 'none';
    }
    else {
      styles.style.display = 'block';
    }
  }, false);
  
  [].slice.apply(document.querySelectorAll('.size span')).forEach(function(element){
    
    element.addEventListener('touchstart', function (e){
      e.preventDefault();
      loading.style.display = "block";
      styles.style.display = "none";

      if (typeof store.get(bookSlug + '-size') !== 'undefined') {
        var fontsize = ( store.get(bookSlug + '-size') == 100 ) ? 130 : 100;
        store.set(bookSlug + '-size', fontsize)
      }
      else {
        store.set(bookSlug + '-size', 100);
      }

      bookCreate();
    }, false);
    
  });
  
  [].slice.apply(document.querySelectorAll('.style li')).forEach(function(element){
    
    element.addEventListener('touchstart', function (e){
      e.preventDefault();
      loading.style.display = "block";
      styles.style.display = "none";

      if (typeof store.get(bookSlug + '-style') !== 'undefined') {
        store.set(bookSlug + '-style', element.className)
      }
      else {
        store.set(bookSlug + '-style', element.className);
      }

      bookCreate();
    }, false);
    
  });
  
};

window.addEventListener('orientationchange', bookCreate, false);
document.addEventListener('touchmove', function (e) { e.preventDefault(); scroll(); }, false);

var designs = {
  'default': {
    'fontfamily':'American Typewriter',
    'bgcolor':'#F0E8D1',
    'color':'#463220',
    'titlefontsize':'20px',
    'authorfontsize':'13px',
    'pfontsize':'13px',
    'lineheight':'25px',
    'footer':'black',
    'aa':'#463220',
    'logolink':'#463220'
  },
  'night': {
    'fontfamily':'Times New Roman',
    'bgcolor':'black',
    'color':'white',
    'titlefontsize':'20px',
    'authorfontsize':'13px',
    'pfontsize':'13px',
    'lineheight':'25px',
    'footer':'black',
    'aa':'#463220',
    'logolink':'#463220'
  },
  'beach': {
    'fontfamily':'Marker Felt',
    'bgcolor':'#F0E8D1',
    'color':'#463220',
    'titlefontsize':'20px',
    'authorfontsize':'13px',
    'pfontsize':'13px',
    'lineheight':'25px',
    'footer':'black',
    'aa':'#463220',
    'logolink':'#463220'
  },
  'old': {
    'fontfamily':'Georgia',
    'bgcolor':'#463220',
    'color':'white',
    'titlefontsize':'20px',
    'authorfontsize':'13px',
    'pfontsize':'13px',
    'lineheight':'25px',
    'footer':'white',
    'aa':'#463220',
    'logolink':'#463220'
  },
  'geek': {
    'fontfamily':'Kailasa',
    'bgcolor':'#000',
    'color':'green',
    'titlefontsize':'20px',
    'authorfontsize':'18px',
    'pfontsize':'16px',
    'lineheight':'25px',
    'footer':'#FFF',
    'aa':'#463220',
    'logolink':'#463220'
  },
  
  'test': {
    'fontfamily':'Courier New',
    'bgcolor':'red',
    'color':'black',
    'titlefontsize':'40px',
    'authorfontsize':'30px',
    'pfontsize':'9px',
    'lineheight':'10px',
    'footer':'black',
    'aa':'#463220',
    'logolink':'#463220'
  }

};