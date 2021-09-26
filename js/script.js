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
    const deadLine = '2022-05-11';

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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
        'tets'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "vegy",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        5,
        '.menu .container',
        'menu__item',
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "vegy",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12,
        '.menu .container',
        'menu__item',
    ).render();


// ========================FORMS====================================

const forms = document.querySelectorAll('form');
const message ={
    loading:"img/form/spinner.svg",
    succes:"Thanks",
    failure:"Smtms wrong"
}
forms.forEach(item=>{
    postData(item);
});

function postData (form){
    form.addEventListener('submit',(e)=>{
        e.preventDefault();

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText =`
        display:block;
        margin:0 auto;`
        // form.append(statusMessage);
        
        form.insertAdjacentElement('afterend',statusMessage);


        const formData = new FormData(form);
        //Formdata on JSON

        const object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });

      

        fetch('server.php',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(object)
        }).then(data => data.text())
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
    },4000)
}
fetch('https://jsonplaceholder.typicode.com/todos/1')
.then(response => response.json())
.then(json => console.log(json))
});