//let number = document.getElementById('scriptElement').dataset.numbers


const repeatNumber = JSON.parse(document.getElementById("data").textContent);
// console.log(repeatNumber)

for (let number = 1; number <= repeatNumber; number++) {
    if(number){
        // console.log(number)
        new  Slider({
            number ,
            el : document.querySelector(`#sliders${number}`),
            body : document.querySelector(`#sliders-body${number}`) ,
            slideClass : 'slide',
            currentSlides : (slides) => {
                console.log(slides)
            },
            auto : 3000
        })
    }
}