class sliderShow {
    sliderIndex = 1;

    constructor(options){
        this.options = options;

        this.initalStuff();

        this.createNextAndPrevBtns();
        this.createDots();
        this.showSlides(1);
        this.setInterVal()
    }

    initalStuff(){
        let { el : sliderElement , slideClass , auto } = this.options

        if(! sliderElement){ throw Error('slider element dose not exist') };

        Number.isInteger(auto) ? this.auto = auto : this.auto =  0

        this.sliders = [ ...sliderElement.children ].filter(element => element.classList.contains(slideClass))
        // console.log(sliders)

    }

    createNextAndPrevBtns(){
        let { el : sliderElement } = this.options
        
        sliderElement.insertAdjacentHTML('beforeend' , `
            <a class="next">&#10095;</a>
            <a class="prev">&#10094;</a>
        `)

        sliderElement.querySelector('.next').addEventListener('click' , () => this.nextAndPrevSlide(this.sliderIndex += 1) )
        sliderElement.querySelector('.prev').addEventListener('click' , () => this.nextAndPrevSlide(this.sliderIndex -= 1) )
        
    }

    nextAndPrevSlide = (n) => { 
        this.resetInterVal()
        this.showSlides(n) 
    }

    currentSlide = n => { 
        this.resetInterVal()
        this.showSlides(this.sliderIndex = n) 
    }

    createDots(){
        let { el : sliderElement } = this.options

        let dotElements =  [ ...this.sliders ].map((slider , index) => `<span class="sliderShowDot" data-slide="${index+1}"></span>` )

        // console.log(dotElements)
        let sliderShowDots = document.createElement('div');
        sliderShowDots.classList.add('sliderShowDots');
        sliderShowDots.innerHTML = `${dotElements.join('')}`

        sliderElement.after(sliderShowDots)

        this.sliderShowDots = sliderShowDots.querySelectorAll('.sliderShowDot');
        this.sliderShowDots.forEach(dot =>  dot.addEventListener('click' , e => { this.currentSlide(parseInt(e.target.dataset.slide)) }))

    }

    showSlides(number){
        let { el : sliderElement , slideClass , currentSlider } = this.options

        if(number < 1){ this.sliderIndex = this.sliders.length }
        if(number > this.sliders.length){ this.sliderIndex = 1 }

        this.sliderShowDots.forEach(dot => dot.classList.remove('active'));

        sliderElement.querySelector(`.${slideClass}.active`).classList.remove('activeVisual');

        sliderElement.querySelector(`.${slideClass}.active`).classList.add('sliderVisual')

        sliderElement.querySelector(`.${slideClass}.active`).classList.remove('active');

        // sliderElement.querySelector(`.${slideClass}.active`).addEventListener('transitionend', function(e) {
        //     sliderElement.querySelector(`.${slideClass}.active`).classList.remove('active');

        // });

        // ////  // 




        this.sliders[this.sliderIndex-1].classList.remove('sliderVisual');

        this.sliders[this.sliderIndex-1].classList.add('active');

        setTimeout(() => {
        this.sliders[this.sliderIndex-1].classList.add('activeVisual');
        }, 20);

        this.sliderShowDots[this.sliderIndex-1].classList.add('active')

        // box.addEventListener('transitionend', function(e) {
        //   box.classList.add('hidden');
        // }


        if(currentSlider){ currentSlider(this.sliders[this.sliderIndex-1]) }

    }

    setInterVal(){
        if(this.auto !== 0){
            this.intervalId = setInterval(() => this.showSlides(this.sliderIndex += 1) , this.auto);
        }
    }

    resetInterVal(){
        clearInterval(this.intervalId)
        this.setInterVal();
    }


}