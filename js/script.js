window.addEventListener('DOMContentLoaded',()=> {
    // TABS
    const tabsParent = document.querySelector('.tabheader__items'),
    tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent');


    function hideTabContent (){
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show','fade');
        });
        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

      
    function showTabContent(i = 0){
        tabsContent[i].classList.add('show','fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }    
    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click',(event) =>{
        const target = event.target;
        // console.log(target);
        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i)=>{
                if(target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // TABS END

    // Timer
    const deadLine = '2022-05-20';

    function getTimeRemaining(endTime){
        const t = Date.parse(endTime) - Date.parse(new Date()),
            days = Math.floor(t/(1000*60*60*24)),
            hours = Math.floor((t / (1000* 60 * 60 ) % 24)),
            minutes = Math.floor((t/1000/60) % 60),
            seconds = Math.floor((t/1000) % 60);
            return{
                'total':t,
                'days': days,
                'hours':hours,
                'minutes':minutes,
                'seconds':seconds
            };
    }
    function getZero(num){
        if(num>0 && num < 10){
            return `0${num}`;   
        }else{
            return num;
        }
    }

    function setClock (selector, endTime){
            const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock,1000);
            

            updateClock();
        
        function updateClock(){
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total<= 0 ){
                clearInterval(timeInterval);
            }

        }    
    }    
    setClock('.timer',deadLine);
    //End Timer

    //Start modal
    const modalTigger  = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
         

     // Open modal realization
    function openModal (){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow='hidden';

        clearInterval(modalTimerId);
    };
    // Open modal Listener
    modalTigger.forEach(btn=>{
        btn.addEventListener('click',openModal) ; 
    });
 
    // close modal realization
    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow=''; 
    }
    
    // close modal realization (Outside the modal )
    modal.addEventListener('click',(e)=>{
        if(e.target === modal || e.target.getAttribute('data-close')== ''){
           closeModal();
        }
    });
    // close modal realization (ESC button )
    document.addEventListener('keydown', (e)=>{
        if(e.code === "Escape" ){
            closeModal();
        }
    });
    
    const modalTimerId = setTimeout( openModal,50000);
    
 //  realization a modal when the user has reached the end of the page
    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            //removal EventListener after the first show
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

   
    window.addEventListener('scroll', showModalByScroll);

    // realization classes for cards
    class MenuCard{
        constructor (src, alt, title, descr,price,parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            //dollars rate
            this.transfer = 2.5;
            this.changeToBYN();
        }
        //  BYN rate
        changeToBYN(){
            this.price = +this.price * this.transfer;
        }
        // Реализация рендера на страницу в котрый придет в PARENTSELECTOR
        render (){
            
            const element = document.createElement('div');
            // checking what comes to classes, if the array is empty, then add a default = menu__item to it, otherwise we go through the classes and add className
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(className => element.classList.add(className))
            
            }
           
            element.innerHTML = `
               
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> BYN</div>
                    </div>
                
            `;
            this.parent.append(element);


        }

    }
    //  function  getResource from db.json  
    const getResource = async (url) =>{
        const res = await fetch(url);

        if(!res.ok){
           throw new Error(`Could not fetch ${url}, status:${res.status}`);
        }


            return await res.json();
        };

        getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price})=>{
                new MenuCard(img, altimg, title, descr, price,'.menu .container').render();
            });
        });

        // ========AXIOS
        // axios.get('http://localhost:3000/menu')
        // .then(data =>{
        //         data.data.forEach(({img, altimg, title, descr, price})=>{
        //            new MenuCard(img, altimg, title, descr, price,'.menu .container').render();
        //        });
        // });
    

// ========================FORMS====================================

const forms = document.querySelectorAll('form');
const message ={
    loading:"img/form/spinner.svg",
    succes:"Thanks",
    failure:"json-server disconnected"
}
forms.forEach(item=>{
    bindPostData(item);
});

const postData = async (url, data) =>{
const res = await fetch(url, {
    method:'POST',
    headers:{
        'Content-type':'application/json'
    },
    body:data

});
    return await res.json();
};


function bindPostData (form){
    form.addEventListener('submit',(e)=>{
        e.preventDefault();

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText =`
        display:block;
        margin:0 auto;`
        ;
        // form.append(statusMessage);
        
        form.insertAdjacentElement('afterend',statusMessage);


        const formData = new FormData(form);
        //Formdata on JSON

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

      

        postData('http://localhost:3000/requests',json)
        .then(data=>{
            console.log(data);
            showThanksModal(message.succes);
            
            statusMessage.remove(); 
        }).catch(()=>{
            showThanksModal(message.failure);
        }).finally(()=>{
            form.reset();
        });



       
    });
}


function showThanksModal(message){
    const prevModalDialog = document.querySelector('.modal__dialog');
    
    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML=`
    <div class="modal__content">
    <div data-close="" class="modal__close">×</div>
    <div class="modal__title">${message} </div>
    </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(()=>{
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    },4000);
}
fetch(' http://localhost:3000/menu')
    .then(data=>data.json())
    .then(res => console.log(res));



    // =================Slider=====================
    const slides =document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField =document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    
    if(slides.length < 10){
            total.textContent = `0${slides.length}`;
            current.textContent =`0${slideIndex}`;
         }else{
             total.textContent = slides.length;
             current.textContent = slideIndex;
        }

    slidesField.style.width= 100 * slides.length + '%';
    slidesField.style.display='flex';
    slidesField.style.transition = '0.5 all';

    slidesWrapper.style.overflow ='hidden';



    slides.forEach(slide =>{
        slide.style.width = width;
    });


    slider.style.position ='relative';
    const indicators = document.createElement('ol'),
          dots =[];
    indicators.classList.add('.carousel-indicators');
    indicators.style.cssText =`
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i =0; i <slides.length; i++ ){
        const dot =document.createElement('li');
        dot.setAttribute('data-slider-to', i + 1);

        dot.style.cssText =`
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
        `;
        if( i == 0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

     function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    next.addEventListener('click',()=>{
        if(offset == deleteNotDigits(width) * (slides.length - 1)){
            offset = 0;
        }else{
            offset += deleteNotDigits(width) ;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }

        if(slides.length<10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1'; 
    });

    prev.addEventListener('click',()=>{
        if(offset == 0){
            
            offset = deleteNotDigits(width)  * (slides.length - 1);
        }else{
            offset -= deleteNotDigits(width) ;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1){
            slideIndex =slides.length;
        }else{
            slideIndex--;
        }
       
        if(slides.length<10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1'; 
    });

    dots.forEach(dot =>{
        dot.addEventListener('click',(e)=>{
            const  slideTo = e.target.getAttribute('data-slider-to');

            slideIndex= slideTo;
            offset  = deleteNotDigits(width)  * (slideTo - 1);
            
            slidesField.style.transform = `translateX(-${offset}px)`;

            if(slides.length<10){
                current.textContent = `0${slideIndex}`;
            }else{
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = '1'; 
        });
    });

    //================Calc ======================

    const result =document.querySelector('.calculating__result span');

   
    let sex ,
     height, 
     weight, 
     age,
    ratio ;

    if(localStorage.getItem('sex')){
        sex=localStorage.getItem('sex');

    }else{
        sex='female';
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')){
        ratio =localStorage.getItem('ratio');

    }else{
        ratio=1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector,activeClass){
        const elements = document.querySelectorAll(selector); 

        elements.forEach(elem =>{
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });

    }
    initLocalSettings('#gender div','calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div','calculating__choose-item_active');

    function calcTotal (){
        if(!sex || !height || !weight || !age ||!ratio){
            result.textContent ='____';
            return;
        }

        if (sex === 'female'){
            result.textContent = Math.round ((447.6 + (9.2 * weight ) + (3.1 * height) - (4.3 * age )) * ratio);
        }else {
            result.textContent = Math.round( (88.36 + (13.4 * weight ) + (4.8 * height) - (5.7 * age )) * ratio);
        }
    }
    calcTotal();

    function getStaticInformation (selector, activeClass){
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem =>{
            // get each element and give it addEventListener from parent
            // event delegation gives a bug
            elem.addEventListener('click', (e)=>{
                if(e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                }else{
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id') );
                }
                
                elements.forEach(elem =>{
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });

        
    }
    getStaticInformation('#gender div','calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div','calculating__choose-item_active');


    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input',()=>{
            //validation input data
            // D - not Digets
            // g -global
            if(input.value.match(/\D/g)){
                input.style.border ='1px solid red';
            }else{
                input.style.border ='none';
            }
            
            switch(input.getAttribute('id')) {
                case 'height':
                    height =+input.value;
                    break;
                case 'weight':
                    weight =+input.value;
                    break;
                case 'age':
                    age =+input.value;
                    break;        
            }
            calcTotal();
        });
        
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});

//npx json-server --watch db.json 