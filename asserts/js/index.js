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
  const islLight = now > sunTimes.sunrise && now < sunTimes.sunset

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

function pixelate(imageData, pixelSize) {
  const {width, height, data} = imageData;
  
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // 获取当前块的像素位置
      const pixelPos = (y * width + x) * 4;
      
      // 计算块的平均颜色
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const blockPos = ((y + dy) * width + (x + dx)) * 4;
          r += data[blockPos];
          g += data[blockPos + 1];
          b += data[blockPos + 2];
          count++;
        }
      }
      
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      
      // 将整个块设置为平均颜色
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const blockPos = ((y + dy) * width + (x + dx)) * 4;
          data[blockPos] = r;
          data[blockPos + 1] = g;
          data[blockPos + 2] = b;
        }
      }
    }
  }
  
  return imageData;
}

async function handleImage() {
  const canvas = document.getElementById('profile')
  const ctx = canvas.getContext('2d')
  
  const img = new Image()
  img.src = '/asserts/image/profile.jpg'

  img.onload = ()=>{
    canvas.width = img.width
    canvas.height = img.height
    
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data

    // const pixelSize = 10

    // for (let y = 0; y < canvas.height; y += pixelSize) {
    //   for (let x = 0; x < canvas.width; x += pixelSize) {
    //     // 获取当前块的起始位置
    //     const pixelPos = (y * canvas.width + x) * 4;
        
    //     // 计算块的平均颜色
    //     let r = 0, g = 0, b = 0, a = 0, count = 0;
        
    //     for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
    //       for (let dx = 0; dx < pixelSize && x + dx < canvas.width; dx++) {
    //         const blockPos = ((y + dy) * canvas.width + (x + dx)) * 4;
    //         r += data[blockPos];
    //         g += data[blockPos + 1];
    //         b += data[blockPos + 2];
    //         a += data[blockPos + 3];
    //         count++;
    //       }
    //     }
        
    //     r = Math.round(r / count);
    //     g = Math.round(g / count);
    //     b = Math.round(b / count);
    //     a = Math.round(a / count);
        
    //     // 将整个块设置为平均颜色
    //     for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
    //       for (let dx = 0; dx < pixelSize && x + dx < canvas.width; dx++) {
    //         const blockPos = ((y + dy) * canvas.width + (x + dx)) * 4;
    //         data[blockPos] = r;
    //         data[blockPos + 1] = g;
    //         data[blockPos + 2] = b;
    //         data[blockPos + 3] = a;
    //       }
    //     }
    //   }
    // }
    
    // // 将处理后的像素数据放回canvas
    // ctx.putImageData(imageData, 0, 0);
    
    // for (let i = 0; i < data.length; i += 4) {
    //   // 反转RGB通道（Alpha通道保持不变）
    //   data[i] = 255 - data[i];     // 红色通道
    //   data[i + 1] = 255 - data[i + 1]; // 绿色通道
    //   data[i + 2] = 255 - data[i + 2]; // 蓝色通道
    //   // data[i + 3] 是Alpha通道，保持不变
    // }
    
    // 将处理后的数据放回Canvas
    // ctx.putImageData(imageData, 0, 0);

  }

}

handleImage()

