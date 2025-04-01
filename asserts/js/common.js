'use strict'
async function getUserCurrentPos() {
  try {
    const url = 'https://ipapi.co/json'
    const data = await fetch(url).then(r=>r.json())
    return { 
      latitude: data.latitude, 
      longitude: data.longitude 
    }
  } catch {
    navigator.permissions.query({name:'geolocation'}).then(
      status=>{
        if(status.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            pos=>{
              const { latitude, longitude } = pos.coords
              
            },
            error=>{
              console.error(error.message)
            }
          )
        }
      }
    )
  }
}

async function isDayTime() {
  const { latitude, longitude } = await getUserCurrentPos()
  const now = new Date()
  const { timeZone } = window.Intl.DateTimeFormat().resolvedOptions()
  const sunTimes = window.SunCalc.getTimes(now, latitude, longitude)
  const isLight = now > sunTimes.sunrise && now < sunTimes.sunset

  alert(isLight)

}

async function getUserLanguage() {
  const browserLanguage = navigator.language || navigator.userLanguage
  const locale = window.Intl.DateTimeFormat().resolvedOptions().locale
  const userLanguage = browserLanguage || locale

  if(/^zh/.test(userLanguage)) {
    return 'chinese'
  } else if(/^ja/.test(userLanguage)) {
    return 'japanese'
  } else {
    return 'english'
  }
}


async function handleImage() {
  const container = document.getElementsByTagName('main')[0]
  const canvas = document.getElementById('profile')
  const ctx = canvas.getContext('2d')
  const { width, height } = container.getBoundingClientRect()

  const img = new Image()
  img.src = '/asserts/image/profile.jpg'

  img.onload = ()=>{
    canvas.width = width * 0.7
    canvas.height = height
    
    ctx.drawImage(img, -screen.width*0.7*0.15, -height*0.2, img.width/1.15, img.height/1.15)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data
    const theme = document.body.getAttribute('data-theme')
    const isDark = theme && theme === 'dark'

    for(let i = 0; i < data.length; i += 4) {
      const value = isDark ? 25 : 230
      
      if(data[i] != 51 && data[i+1] != 51 && data[i+2] != 51) {
        data[i] = value
        data[i+1] = value
        data[i+2] = value
      }

      if(data[i] == 51 && data[i+1] == 51 && data[i+2] == 51) {
        data[i] = value
        data[i+1] = value
        data[i+2] = value
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }
}

handleImage()

window.addEventListener('resize', handleImage)
