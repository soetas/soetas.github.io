"use strict"

function sleep(seconds) {
  const start = Date.now()
  while((Date.now() - start) < seconds*1000) {}
}

function main() {
  const gridIcon = document.querySelector('[class~=icon-grid]')
  const overlay = document.getElementById('overlay')
  
  overlay.addEventListener('click', ()=>{
    overlay.classList.add('hidden')
  })

  gridIcon.addEventListener('click', ()=>{
    overlay.classList.remove('hidden')

  })

  const introduceSecond = document.querySelector('[class~=introduce__second]')
  const text = 'Samuel, a front-end development engineer and open source enthusiast.'
  
  let i = 0

  const timer = setInterval(()=>{
    if(i >= text.length) return clearInterval(timer)
    introduceSecond.textContent += text[i++]
  }, 100)
  


}

window.onload = main 
